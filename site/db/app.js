'use strict';

const Emitter = require('events').EventEmitter,
    async = require('async'),
    mongoose = require('mongoose'),
    garbage = (new Array(128)).join('x'),
    DbError = require("./libs/error"),
    loadStrategies = {
        Student: (model, data) => {
            return model.update({name: data.name, "statements.spec": data.statements[0].spec}, {$set: {"statements.$": data.statements[0]}, $unset: {_garbage: ""}}).then(
                (raw) => {
                    if(raw.n)  return true;
                    else return model.update({name:data.name}, {$push: {statements: data.statements[0]}, $setOnInsert: {_id: Date.now(), _garbage: garbage}}, {upsert:true});
                }
            );
        },
        Spec: (model, data) => {
            return model.update({name: data.name, specType: data.specType}, {$set: data, $setOnInsert: {_id: Date.now()}}, {upsert: true});
        }
    };

module.exports = (config, logFactory, errorHandler) => {
    const log = logFactory(module);

    class Db extends Emitter{

        constructor(threads = 50) {
            super();
            this.queue = async.queue(this._save.bind(this), threads);
            this.queue.drain = ()=> this.emit("db:drain");
        }

        start() {
            return Promise.all([config.get("mongo:mainDb"), config.get("mongo:options")]).then(
                (res) => {
                    const dbPath = res[0],
                        options = res[1];

                    this.connect = mongoose.connect(dbPath, options);
                    this.on('save:data', this.push.bind(this));
                    return this;
                }
            );

        }

        push(data) {
            this.model(data.type).then(
                (model)=> this.queue.push({type: data.type, data: data.body, model: model}, this._queueCallback.bind(this)),
                () => log('debug', 'Не пройшов провірку: ' + data.body)
            );

        }

        model(modelType, year) {
            let modelName, model;

            return config.get("yearArchives").then(
                (years) => {
                    const schemas = require('./libs/addModels')(mongoose, years);
                    year || (year = years[years.length - 1]);
                    modelName = modelType + year;
                    if(!~years.indexOf(year)) throw new Error("We don't have archive for this year.");
                    if(!schemas[modelType]) throw new Error("Invalid model type.");
                    if(!~this.connect.modelNames().indexOf(modelName)) this.connect.model(modelName, schemas[modelType]);
                    return this.connect.model(modelName);
                }
            );


        }

        _queueCallback(err) {
            if(err) return console.log(err); /*errorHandler(new DbError('Сталась помилка при збереженні ' + data.body.name + ': ' + err.message));*/
            this.emit('db:saved:data');
        }

        _save(query, callback) {

            const data = query.data,
                model = query.model,
                strategy = loadStrategies[query.type];

            let prom;

            if(strategy) prom = strategy(model, data);
            else prom = model.update({name: data.name}, {$set: data, $setOnInsert: {_id: Date.now()}}, {upsert: true});


            prom.then(
                ()=> callback(null),
                err => {
                    this.emit("save:error", err, data);
                    if(err.code === 11000) return this._save(query, callback);
                    else callback(err, data);
                });
        }


    }

    return Db;


};

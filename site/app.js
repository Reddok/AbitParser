"use strict";

const path = require("path"),
    Emitter = require('events'),
    config = require('./config'),
    fs = require('fs'),
    diContainer = require("./libs/diContainer")(),
    logFactory = require('./libs/log'),
    log = logFactory(module);

diContainer.register("configPath", path.join(__dirname, './config'));
diContainer.register("logFactoryPath", path.join(__dirname, './libs/log'));
diContainer.register("DbPath", path.join(__dirname, './db/app'));
diContainer.register("errorHandlerPath", path.join(__dirname, './libs/errorHandler'));
diContainer.register("dateToStringPath", path.join(__dirname, './libs/dateToString'));
diContainer.register("mailPath", path.join(__dirname, './libs/mail'));
diContainer.register("config", config);
diContainer.register("logFactory", logFactory);
diContainer.factory("mail", require("./libs/mail"));
diContainer.factory("errorHandler", require('./libs/errorHandler'));
diContainer.factory("Db", require("./db/app"));
diContainer.factory("Server", require('./server/app'));
diContainer.factory("Parser", require('./parser/app'));


class App extends Emitter{

    constructor() {
        super();

        this._paused = false;
        this.errors = [];

        this._init();
    }

    start() {

        let interval;


        this.server.start();
        this.db.start().then(

            () => {

                this.parser.on("get:parsed:data", this.sendData.bind(this));

                this.parser.on('parser:finish', () => {
                    log('debug', 'Залишилось зробити ' + this.db.queue.length() + ' завдань!');
                    this.db.once("db:drain", () => {
                        log('info', 'Завантажено в базу даних о:' + new Date());
                        config.set("lastUpdated", (new Date).toString());
                        clearTimeout(this._progress);
                        console.timeEnd("Process");
                        console.log("All the errors", this.errors);
                    });
                });

                this.parser.on("parser:refuse", () => {
                    clearTimeout(this._progress);
                    console.timeEnd("Process");
                });

                this.db.on("save:error", (err, data) => {
                    this.errors.push({error: err.message, data: data});
                });

                config.get('parser:interval').then((interval) => {
                    setInterval(this.startParsing.bind(this), interval);
                    this.startParsing();
                });

                log('debug', 'Додаток запущений...');

            }

        );


    }

    _init() {

        let Db = diContainer.get("Db"),
            Server = diContainer.get("Server"),
            Parser = diContainer.get("Parser");

            return Promise.all([ config.get('mongo:threads'), config.get('parser:threads') ])
                .then( (mongoThreads, parserThreads) => {

                    this.db = new Db(mongoThreads);
                    this.server = new Server();
                    this.parser = new Parser(parserThreads);

                    this.emit('init');

                });

    }

    sendData(data) {
        this.db.emit('save:data', data);
        this._parserDown();
    }

    startParsing() {
        log('debug', 'parsing start');
        config.get("parser:baseUrl").then((baseUrl) => {
            this.parser.start(baseUrl);
            this._progress = setInterval(()=> {
                console.log('Залишилось зробити базі данних ' + this.db.queue.length() + ' завдань! Зараз обробляються ' + this.db.queue.running() + " завдань!");
                console.log('Залишилось зробити парсеру ' + this.parser._parser._queue.length() + ' завдань! Зараз обробляються ' + this.parser._parser._queue.running() + " завдань!");
            }, 300000);
            console.time("Process");
        });
    }

    _parserDown() {
        if(process.memoryUsage().heapTotal > 1000000000 && !this.db.queue.idle() && !this._paused) {
            this.parser.emit('parser:pause');
            this._paused = setInterval(this._parserUp.bind(this), 5000);
            log('debug', 'Парсинг призупинено');
        }
    }

    _parserUp() {

        if(this.db.queue.idle()) log('debug', 'Після ще одного збереження база данних опустіла');
        if( ( process.memoryUsage().heapTotal < 500000000 || this.db.queue.idle() ) && this._paused) {
            this.parser.emit('parser:resume');
            clearInterval(this._paused);
            this._paused = null;
            log('debug', 'Парсинг відновлено');
        }
    }

}

module.exports = App;







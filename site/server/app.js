'use strict';

const cluster = require('cluster'),
    Emitter = require('events');

function factoryServer(logFactory, DbPath, mailPath, logFactoryPath, configPath, dateToStringPath, errorHandlerPath) {

    const log = logFactory(module);


    class Server extends Emitter{

        constructor() {
            super();
        }

        start() {

            cluster.setupMaster({
                exec: 'server/app.js',
                args: [configPath, logFactoryPath, dateToStringPath, mailPath, errorHandlerPath, DbPath]
            });

            require('os').cpus().forEach(() => this.createWorker());
            cluster.on('disconnect', (worker) => log('info', 'Worker has been disconnected ' + worker.id));


            cluster.on('exit', (worker, code, signal) => {
                log('error', 'Cluster worker %d died with exit code %d (%s)', worker.id, code, signal);
                this.createWorker();
            });


            this.on('change:updated:date',() => {
                Object.keys(cluster.workers).forEach((key) => {
                   cluster.workers[key].send({type: "config:change"})
                });
            })

        }

        createWorker() {
            cluster.fork();
            log('debug', 'New worker forked.');
        }

    }

    return Server;

}


if(cluster.isMaster) {
    module.exports = factoryServer;
} else {
    let args = getInitDeps(process.argv.slice(2));
    module.exports = require("./server").apply(null, args);
}



function getInitDeps(arr) {
    return arr.map((dep) => {
       try{
           let obj = JSON.parse(dep);
           return require(obj.path).apply(null, getInitDeps(obj.deps));
       }catch(err){
           return require(dep);
       }
    });

}
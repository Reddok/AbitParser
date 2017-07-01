'use strict';

const winston = require('winston'),
      ENV = process.env.NODE_ENV,
      stringDate = require('../libs/dateToString'),
      config = require('../config');

require('winston-mongodb');

let logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                colorize: true,
                level: (ENV === 'development')? 'debug' : 'error',
                name: 'console_log'
            }),
            new (winston.transports.File)({
                name: 'info-file',
                filename: 'logs/info_log.log',
                level: 'error'
            }),
            new (winston.transports.File)({
                name: 'error-file',
                filename: 'logs/error_log.log',
                level: 'error'
            }),
            /*new (winston.transports.MongoDB)({
                db: config.get('mongo:logsDb'),
                options: config.get('mongo:options'),
                collection: 'info',
                name: 'log_info',
                level: 'info',
                capped: true,
                cappedMax: 10000,
                tryReconnect: true
            }),
            new (winston.transports.MongoDB)({
                db: config.get('mongo:logsDb'),
                level: 'error',
                options: config.get('mongo:options'),
                collection: 'error',
                name: 'log_error',
                capped: true,
                cappedMax: 10000,
                tryReconnect: true
            })*/
        ]
});


const data = {}; /*Змінна з глобальними мета данними, які потрібні при всіх логах. Щоб не писати кожен раз*/

module.exports = function(file) {

    let filename = file.filename.split('\\').slice(-2).join('/');

    function log() {
        let args = configureLogger(filename, arguments);
        logger.log.apply(logger, args);
    }

    log.profile = function(message) {
        let args = configureLogger(filename, arguments);
        logger.profile.apply(logger, args);
    };

    return log;

};

function configureLogger(filename, args) {
    args = args? Array.prototype.slice.call(args) : [];

    var meta = args[args.length - 1];
    if( !(args.length > 2 &&  meta === 'object' && meta !== null) ) args.push(meta = {});
    for(var key in data) if(!meta[key]) meta[key] = data[key];
    logger.transports.console_log.label = stringDate.getTime(new Date) + ' ' + filename;
    return args;
}
'use strict';

const koa = require('koa'),
    http = require('http'),
    http_logger = require('koa-logger'),
    parser = require('koa-bodyparser'),
    views = require('koa-hbs'),
    xhr = require('koa-request-xhr'),
    HttpError = require('./libs/httpError'),
    ServerError = require('./libs/serverError'),
    diContainer = require('./libs/diContainer')();

module.exports = function(config, logFactory,  dateToString, mail, errorHandler, DbFactory) {

    let app = koa(),
        log = logFactory(module),
        server;

    diContainer.register("config", config);
    diContainer.register("logFactory", logFactory);
    diContainer.register("HttpError", HttpError);
    diContainer.register("ServerError", ServerError);
    diContainer.register("dateToString", dateToString);
    diContainer.register("normalizeQuery", require("./libs/normalizeQuery"));
    diContainer.register("mapFile", require("./libs/mapStatFile"));
    diContainer.factory("errorHandler", errorHandler);
    diContainer.factory("mail", mail);
    diContainer.factory("Db", DbFactory);
    diContainer.factory("getModel", require('./libs/getModel'));
    diContainer.factory("RegionController", require('./controllers/region'));
    diContainer.factory("UniverController", require('./controllers/univer'));
    diContainer.factory("SpecController", require('./controllers/spec'));
    diContainer.factory("StudentsController", require('./controllers/student'));
    diContainer.factory("PathController", require('./controllers/path'));
    diContainer.factory("Router", require('./routes'));

    let db = new (diContainer.get("Db"));


    diContainer.register("connect", db);

    db.start().then(
        () => {

            /* Міделвари */
            app.use(parser());
            app.use(http_logger());
            app.use(xhr());

            /*Реєстрація хелперів для вьюшки*/
            views.registerHelper('staticMap', diContainer.get("mapFile"));
            views.registerHelper('string', (fn)=> fn.toString());

            /*Ще міделвари*/
            app.use(views.middleware({viewPath: __dirname + '/public'}));

            app.use(function* (next) {
                try{
                    yield next;
                }catch(err) {
                    if(err instanceof HttpError) {
                        this.status = err.status;
                        this.body = {type: 'HttpError', message: 'Error: ' + err.message}
                    } else {
                        setTimeout(() => {
                            log('error', 'Failsafe shutdown.');
                            process.exit(1);
                        }, 5000);

                        let worker = require('cluster').worker;
                        if(worker) worker.disconnect();
                        server.close();

                        try{
                            this.status = 500;
                            this.body = {type: 'ServerError', message: 'Internal server error. Try again later'};
                            console.log('Actual error stack', err.stack);
                            diContainer.get("errorHandler")(new ServerError(err));
                        }catch(err) {
                            log('error', 'Unable to send error, because ', err);
                        }


                    }
                }
            });

            app.use(function* (next) {
                if(!( this.state.xhr || /\B\/(?:public(?:\/|\b)|\B)/.test(this.url) )){
                    this.status = 303;
                    this.redirect('/')
                } else {
                    yield next;
                }

            });


            /*Підключення роутера, пропускаючи через нього апп*/
            diContainer.get("Router")(app);


            server = http.createServer(app.callback())
                .listen(3000, () => log('info', 'Server running on port 3000. Process id ' + process.pid))

        },
        (err) => console.log("DB error", err)
    );



};




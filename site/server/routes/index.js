'use strict';

const router = require('koa-router')(),
    serve = require('koa-send');


module.exports = function(config, mapFile, dateToString, HttpError, RegionController, UniverController, SpecController, StudentsController, PathController) {

    return function(app) {

        const regionRouter = RegionController.registerRoutes(),
            univerRouter = UniverController.registerRoutes(),
            specRouter = SpecController.registerRoutes(),
            studentsRouter = StudentsController.registerRoutes(),
            pathRouter = PathController.registerRoutes();

        router.get('/', function* () {

            let lastUpdated = yield config.get("lastUpdated"),
                baseUrl = mapFile.getBaseUrl();

            lastUpdated = new Date(lastUpdated);

            yield this.render('index', {baseUrl: baseUrl, lastUpdated: dateToString.getDate(lastUpdated) + " " + dateToString.getTime(lastUpdated)});
        });

        router.get('/archive', function* () {
            this.body = yield config.get("yearArchives");
        });

        router.use('/regions', regionRouter.routes(), regionRouter.allowedMethods());
        router.use('/univers', univerRouter.routes(), univerRouter.allowedMethods());
        router.use('/specs', specRouter.routes(), specRouter.allowedMethods());
        router.use('/students', studentsRouter.routes(), studentsRouter.allowedMethods());
        router.use('/pathLocation', pathRouter.routes(), pathRouter.allowedMethods());



        router.get('/public/*', function*() { yield serve(this, 'server/' + this.path);});

        app.use(router.routes()).use(router.allowedMethods());

        app.use(function* () {
            console.log('Не знайшло роуту', this.path);
            throw new HttpError(404);
        });
    }



};

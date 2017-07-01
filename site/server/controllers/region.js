'use strict';
const Router = require('koa-router');

function RegionController(getModel, HttpError) {

    return {
        registerRoutes: function() {
            let router = new Router();

            router.use(function* (next) {
                this.state.Model = yield getModel("Region", this.query.year);
                yield next;
            });

            router.get('/', this.read);
            router.get('/:id', this.show);

            return router;
        },
        read: function* (){
            let models = yield this.state.Model.find({}).sort({'name': 1});
            this.body = models.map(queryMap);
        },
        show: function*() {
            let id = this.params.id,
                model;

            if(!id) throw new HttpError(400);
            model = yield this.state.Model.findById(id);
            if(!model) throw new HttpError(404);

            this.body = queryMap(model);
        }

    }

}

function queryMap(obj) {
    return {
        _id: obj._id,
        name: obj.name,
        parsed_id: obj.parsed_id
    }
}

module.exports = RegionController;
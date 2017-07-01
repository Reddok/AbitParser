'use strict';
const Router = require('koa-router');

function PathController(getModel) {

    return {
        registerRoutes: function() {
            let router = new Router();

            router.use(function*(next) {
                this.state.RegionModel = yield getModel("Region", this.query.year);
                this.state.UniverModel = yield getModel("Univer", this.query.year);
                this.state.SpecModel = yield getModel("Spec", this.query.year);

                yield next;
            });

            router.get('/', this.read);

            return router;
        },

        read: function* (){

            let query = this.query,
                result = {};

            if(query.spec) {
                result.spec = yield this.state.SpecModel.findById(query.spec, {name: 1, parent: 1});
                result.univer = yield this.state.UniverModel.findOne({parsed_id: result.spec.parent}, {name: 1, parent: 1});
                result.region = yield this.state.RegionModel.findOne({parsed_id: result.univer.parent}, {name: 1});
            } else if(query.univer) {
                result.univer = yield this.state.UniverModel.findById(query.univer, {name: 1, parent: 1});
                result.region = yield this.state.RegionModel.findOne({parsed_id: result.univer.parent}, {name: 1});
            } else if(query.region) {
                result.region = yield this.state.RegionModel.findById(query.region, {name: 1});
            }

            this.body = result;
        }


    }

}

module.exports = PathController;
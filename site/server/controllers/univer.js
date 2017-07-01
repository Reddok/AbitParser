'use strict';
const Router = require('koa-router');

function UniverController(getModel, HttpError) {

    return {

        registerRoutes: function() {
            let router = new Router();

            router.use(function* (next) {
                let year = this.query.year;
                this.state.UniverModel = yield getModel("Univer", year);
                this.state.SpecModel = yield getModel('Spec', year);
                yield next;
            });

            router.get('/', this.read);
            router.get('/:id', this.show);
            return router;
        },

        read: function* () {
            let query = this.query || {},
                models;

            models = yield this.state.UniverModel.find(query).sort({name: 1});
            this.body = yield Promise.all(models.map(model => queryMap(model, this.state.SpecModel)));

        },


        show: function* () {
            let id = this.params.id,
                model;

            if(!id) throw new HttpError(400);
            model = yield this.state.UniverModel.findById(id);
            if(!model) throw new HttpError(404);

            this.body = yield queryMap(model, this.state.SpecModel);
        }
    };


    function queryMap(model, ChildModel) {
        return ChildModel.count({parent: model.parsed_id})
            .then((count)=> {
                return {
                    _id: model._id,
                    name: model.name,
                    parsed_id: model.parsed_id,
                    parent: model.parent,
                    children: parseInt(count)
                }
            });
    }

}



module.exports = UniverController;
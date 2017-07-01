'use strict';
const Router = require('koa-router');

function SpecController(getModel, HttpError, normalizeQuery) {

    return {
        registerRoutes: function() {
            let router = new Router();
            router.use(function* (next) {
                let year = this.query.year;
                this.state.SpecModel = yield getModel('Spec', year);
                this.state.StudModel = yield getModel("Student", year);
                yield next;
            });
            router.get('/', this.read);
            router.get('/:id', this.show);
            return router;
        },
        read: function* () {

            let query = normalizeQuery(this.query),
                models;

            models = yield this.state.SpecModel.find(query).sort({name: 1});

            this.body = yield Promise.all(models.map(model => queryMap(model, this.state.StudModel)));
        },
        show: function* () {
            let id = this.params.id,
                model;
            if(!id) throw new HttpError(400);
            model = yield this.state.SpecModel.findById(id);
            if(!model) throw new HttpError(404);
            model = yield queryMap(model, this.state.StudModel);
            this.body = model;
        }
    };


    function queryMap(model, ChildModel) {

        return ChildModel.count({"statements.spec": model.parsed_id}).then((count) => {
            return {
                _id: model._id,
                name: model.name,
                parsed_id: model.parsed_id,
                concurs: model.concurs,
                places: model.places,
                parent: model.parent,
                specType: model.specType,
                children: count
            }
        });

    }

}






module.exports = SpecController;
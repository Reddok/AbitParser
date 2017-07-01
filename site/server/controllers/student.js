'use strict';
const Router = require('koa-router'),
    queryMap = require("../libs/studentsMap");


 function StudentController(config, getModel, HttpError, normalizeQuery) {

     return {

         registerRoutes: function() {
            let router = new Router();
             router.use(function* (next) {
                 const year = this.query.year || yield config.get("yearArchives").pop();
                 this.state.Model = yield getModel('Student', +year);
                 this.state.closing = yield getStateOfYear(year);
                 yield next;
             });
            router.get('/', this.read);
            router.get('/:id', this.show);
            router.get('/search', this.search);
            return router;
         },

        read: function* () {
            let query = this.query,
                models;

            console.time("request");
            models = yield this.state.Model.find({"statements.spec": query["statements.spec"]}).sort({place: 1});
            console.timeEnd("request");
            console.time("handler");
            let body = models.map((model)=> queryMap("single" + this.state.closing, model, query["statements.spec"]));
            console.timeEnd("handler");
            this.body = body;
        },

        search: function* () {
            let query = this.query || {},
                length = 0,
                options = {},
                pattern,
                models;


            if(!query.pattern) return this.body = {records: [], initialLength: 0};

            query.page = +query.page || 1;
            options.limit = +query.per_page;
            options.skip = (query.page - 1) * query.per_page;
            pattern = new RegExp(decodeURIComponent(query.pattern), 'i');

            models = yield this.state.Model.find({name: pattern});

            /*По ідеї, роботу обчислювання кількості, обрізання і сортування массиву моделей має брати на себе БД. Але у випадку обчислення кількості,
            2 запити до БД, хоч і лімітовані,займають більше часу ніж 1 і обробка вручну. Тим не менш може ще щось можна буде придумати
            на цей рахунок*/

            length = models.length;

            models.sort((a, b) => +a._id - +b._id);
            models = models.slice(+options.skip, +options.skip + +query.per_page);
            console.log(options.skip, +options.skip + +query.per_page, models.length);

            this.body = {records: models.map((item) => queryMap("count", item)), initialLength: length};
        },


        show: function* () {
            let id = this.params.id,
                model;

            if(!id) throw new HttpError(400);
            model = yield this.state.Model.findById(id);
            if(!model) throw new HttpError(404);

            this.body = queryMap("all" + this.state.closing, model);
        }

     };


     function getStateOfYear(year) {
         return config.get("activeYear").then((activeYear) => {
             return year === activeYear? "" : "Dated";
         })
     }

 }


module.exports = StudentController;
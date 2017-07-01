define([], function() {


   return {
       show(id) {

           var mapRank = {
                   "free": 2,
                   "cost": 1,
                   "out": 0.5
               };

           require([
               "jquery",
               "apps/regional/modules/student/views/layout",
               "apps/regional/modules/student/views/specList",
               "apps/regional/modules/student/views/paramList",
               'config/views/loading',
               "config/errorHandler",
               "entities/students/entity",
               "entities/specs/entity",
               "equalHeight"
           ], function($, LayoutView, SpecView, ParamView, LoadingView, errorHandler) {

               var fetchingStudent = App.channel.request('student:entity', {initial: {_id: id}}),
                   currentModule = "spec",
                   fethingSpecs,
                   studentModel,
                   specsCollection;

               App.currentModule = currentModule;
               App.regions.showChildView('content', new LoadingView());

               $.when(fetchingStudent)
                   .then(
                       function(model) {
                           var statementsIds;
                           studentModel = model;
                           statementsIds = studentModel.get('statements').map(function(statement) {
                              return statement.spec;
                           });

                           fethingSpecs = App.channel.request('spec:entities', {data: $.param({parsed_id: statementsIds})});
                           return fethingSpecs;
                       }, function(err) { return err }
                   )
                   .then(
                       function(collection) {
                           if(App.currentModule === currentModule) {

                               var layout = new LayoutView({model: studentModel}),
                                   specsView, paramsView;

                               specsCollection = collection;

                               specsView = new SpecView({collection: addChanceAndPlace(specsCollection, studentModel)});
                               paramsView = new ParamView({collection: new Backbone.Collection([
                                   {name: "Украінська мова", score: 173},
                                   {name: "Математика", score: 179},
                                   {name: "Фізика", score: 184}
                               ])});

                               specsView.listenTo(specsView, 'table:childview:spec:show', function(childView) {
                                   App.trigger('students:list', childView.model.get('_id'));
                               });

                               layout.listenTo(layout, 'render', function() {
                                   layout.showChildView('specs', specsView);
                                   layout.showChildView('params', paramsView);
                                   setTimeout(function() { $([layout.getRegion("specs").el, layout.getRegion("params").el]).equalHeights() }, 100);
                               });

                               App.regions.showChildView('content', layout);

                           }

                       }, function(err) { return err }
                   ).fail(
                        function() {
                            errorHandler(new Error('Cталась помилка при зчитуванні данних'));
                        }
               )

           });

           function addChanceAndPlace(collection, user) {
               var statements = user.get("statements"),
                   sum = statements.reduce(function(prev, curStatement) {
                  return prev + mapRank[curStatement.rank]
               }, 0);

               statements.forEach(function(statement) {
                   var spec = collection.findWhere({parsed_id: statement.spec});
                   console.log("finded spec", statement.spec, statement.place, statement.rank, sum);
                   if(!spec) return;
                   spec.set({place: statement.place, chance: Math.round(mapRank[statement.rank]/sum * 100)});
               });

               return collection;
           }

       }
   }


});
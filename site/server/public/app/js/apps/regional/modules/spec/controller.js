define([], function() {


    return {

        show: function(id, parentView) {

            var defer = $.Deferred();

            require([
                "apps/regional/modules/spec/views/layout",
                "apps/regional/modules/spec/views/table",
                'config/filteredCollection',
                'config/filter',
                "entities/specs/entity",
                "entities/students/entity"
            ], function(LayoutView, TableView, FilteredCollection, filterFunction) {

                var fetchingSpec = App.channel.request("spec:entity", {initial: {_id: id}}),
                    specModel;

                return $.when(fetchingSpec)
                    .then(
                        function(model) {
                            var parsed = model.get('parsed_id');
                            specModel = model;
                            return App.channel.request("student:entities", {data: $.param({"statements.spec": parsed})});

                        },
                        function(err) {
                            return err
                        })
                    .then(
                        function(collection) {
                            var layout = new LayoutView({model: specModel}),
                                studentsCollection = new FilteredCollection({collection: collection, filterFunction: filterFunction}),
                                tableView;

                            tableView = new TableView({collection: studentsCollection});

                            tableView.listenTo(tableView, 'table:childview:student:show', function(childView) {
                                App.trigger('student:show', childView.model.get('_id'));
                            });

                            layout.listenTo(layout, 'render', function() {
                                layout.showChildView('students', tableView);
                            });

                            layout.listenTo(parentView, "items:filter", function(criteria) {
                                studentsCollection.filter(criteria);
                            });

                            parentView.listenTo(parentView, "render", function() {
                                parentView.showChildView('content', layout);
                            });

                            parentView.parameters.title = layout.title;
                            defer.resolve();
                         },
                        function(err) {
                            defer.reject(err);
                        }
                    );

            });
            return defer.promise();
        }

    }



});
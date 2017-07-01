define([], function() {


    return {
        show: function(id, parentView) {

            var defer = $.Deferred();

            require([
                'jquery',
                'apps/regional/modules/univer/views/layout',
                'apps/regional/modules/univer/views/table',
                'config/filteredCollection',
                'config/filter',
                'entities/univers/entity',
                'entities/specs/entity'
            ], function($, LayoutView, TableView, FilteredCollection, filterFunction) {

                var fetchingUniver = App.channel.request('univer:entity', {initial: {_id: id}}),
                    fetchingSpecs,
                    univerModel,
                    specsCollection;

                return $.when(fetchingUniver)
                    .then(
                        function(model) {
                            univerModel = model;
                            fetchingSpecs = App.channel.request('spec:entities', {data: $.param({parent: univerModel.get('parsed_id')})});
                            return fetchingSpecs;

                        },
                        function(err) {
                            return err;
                        })
                    .then(
                        function(collection) {

                            var layout = new LayoutView({model: univerModel}),
                                tableView;

                            specsCollection = new FilteredCollection({collection: collection, filterFunction: filterFunction});
                            tableView = new TableView({collection: specsCollection});

                            tableView.listenTo(tableView, 'table:childview:spec:show', function(childView) {
                                App.trigger('students:list', childView.model.get('_id'), childView.model.get('parse_id'));
                            });

                            layout.listenTo(layout, 'render', function() {
                                layout.showChildView('specs', tableView);
                            });

                            layout.listenTo(parentView, "items:filter", function(criteria) {
                               specsCollection.filter(criteria);
                            });

                            parentView.listenTo(parentView, "render", function() {
                                parentView.showChildView('content', layout);
                            });

                            parentView.parameters.title = layout.title;
                            defer.resolve();
                        },
                        function(err) {
                            defer.reject(err);
                        });
            });
            return defer.promise();
        }
    }


});
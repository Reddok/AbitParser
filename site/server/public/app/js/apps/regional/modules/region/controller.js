define([], function() {


    return {
        show: function(id, ParentView) {

            var defer = $.Deferred();

            require([
                'jquery',
                'apps/regional/modules/region/views/layout',
                'apps/regional/modules/region/views/table',
                'config/filteredCollection',
                'config/filter',
                'entities/regions/entity',
                'entities/univers/entity'
            ], function($, LayoutView, TableView, FilteredCollection, filterFunction) {

                var fetchingRegion = App.channel.request('region:entity', {initial: {_id: id}}),
                    fetchingUnivers,
                    regionModel,
                    universCollection;

                $.when(fetchingRegion)
                    .then(
                        function(model) {
                            regionModel = model;
                            fetchingUnivers = App.channel.request('univer:entities', {data: $.param({parent: regionModel.get('parsed_id')})});
                            return fetchingUnivers;
                        },
                        function(err) {
                            return err;
                        })
                    .then(
                        function(collection) {

                            var layout = new LayoutView({model: regionModel}),
                                tableView;

                            universCollection = FilteredCollection({collection: collection, filterFunction: filterFunction});

                            tableView = new TableView({collection: universCollection});


                            tableView.listenTo( tableView, 'table:childview:univer:show', function(childView) {
                                App.trigger('specs:list', childView.model.get('_id'));
                            });

                            layout.listenTo(ParentView, 'items:filter', function(criteria) {
                               universCollection.filter(criteria);
                            });


                            layout.listenTo(layout, 'render', function() {
                                layout.showChildView('univers', tableView);
                            });

                            ParentView.listenTo(ParentView, "render", function() {
                                ParentView.showChildView('content', layout);
                            });

                            ParentView.parameters.title = layout.title;
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
define([], function() {


    return {
        show: function(parentView) {

            var defer = $.Deferred();

            require([
                'jquery',
                'apps/regional/modules/main/views/layout',
                'apps/regional/modules/main/views/collection',
                'config/filteredCollection',
                'config/filter',
                'entities/regions/entity'
            ], function($, LayoutView, CollectionView, FilteredCollection, filterFunction) {

                var fetchingRegions = App.channel.request('region:entities');

                $.when(fetchingRegions).then(
                    function(collection) {

                        var layout = new LayoutView(),
                            regionsCollection = new FilteredCollection({collection: collection, filterFunction: filterFunction}),
                            collectionView = new CollectionView({collection: regionsCollection});

                        collectionView.listenTo(collectionView, 'childview:region:show', function(childView) {
                            App.trigger('univers:list', childView.model.get('_id'));
                        });

                        layout.listenTo(layout, 'render', function() {
                            layout.showChildView('regions', collectionView);
                        });


                        layout.listenTo(parentView, "items:filter", function(criteria) {
                            regionsCollection.filter(criteria);
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
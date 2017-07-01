define([
    'entities/menu/entity'
], function() {

    return {

        listHeader: function() {

            require(['apps/menu/modules/list/views/header', 'apps/menu/modules/list/views/list'], function(HeaderView, MenuView) {

                var links = App.channel.request('menu:entities'),
                    header = new HeaderView(),
                    menu = new MenuView({collection: links});

                menu.listenTo(menu, 'childview:navigate', function(childView) {
                    App.trigger(childView.model.get('navigationTrigger'));
                });

                header.on('render', function() {
                   header.showChildView("menu", menu);
                });

                App.regions.showChildView('menu', header);

            });

        },
        setActiveHeader: function(headerUrl) {

            var links = App.channel.request("menu:entities"),
                headerToSelect = links.find( function(header){
                    return header.get("url") === headerUrl;
                });
            headerToSelect && headerToSelect.select();

        }

    }


});
define([], function() {


    return {

        show: function(query, childShow) {

            require([
                "underscore",
                "apps/regional/modules/layout/views/layout",
                "apps/regional/modules/layout/views/breadcrumb",
                "apps/regional/common/views/panel",
                'config/views/loading',
                'config/errorHandler',
                "entities/location/entity"
            ], function(_, LayoutView, BreadCrumbView, PanelView, LoadingView, errorHandler) {

                var options = {},
                    layout = new LayoutView(),
                    panelView = new PanelView(),
                    currentModule = "regional",
                    dataRequest;

                App.currentModule = currentModule;
                App.regions.showChildView('content', new LoadingView());

                if(query) options.data = $.param(query);
                dataRequest = App.channel.request('location:current', options);

                 $.when(dataRequest, childShow(layout)).then(
                     function(curLocModel) {
                         if(App.currentModule === currentModule) {

                             var breadCrumbView = new BreadCrumbView({model : curLocModel});
                             layout.listenTo(layout, "render", function() {
                                 layout.showChildView("breadcrumb", breadCrumbView);
                                 layout.showChildView("panel", panelView);
                             });

                             breadCrumbView.listenTo(breadCrumbView, "location:change", _.bind(App.trigger, App));
                             panelView.listenTo(panelView, "items:filter", layout.trigger.bind(layout, "items:filter"));

                             App.regions.showChildView('content', layout);

                         } else {
                             layout.remove();
                         }

                    },
                     function(err) {
                         errorHandler(err);
                     }
                 );
            });

        }

    }


});
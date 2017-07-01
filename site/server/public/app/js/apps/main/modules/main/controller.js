define([], function() {


    return {
        show: function() {

            require([
                'apps/main/modules/main/views/layout'
            ], function(LayoutView) {
                App.regions.showChildView('content', new LayoutView());
            });

        }
    }


});
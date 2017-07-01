define(['config/router'], function(BaseRouter) {

    return BaseRouter.extend({

        appRoutes: {
            'search(/)(:params)': "showSearch"
        }

    });

});
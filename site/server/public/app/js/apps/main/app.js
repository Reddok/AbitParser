define([
    'apps/main/router/index',
    'apps/main/controller/index',
    'apps/main/modules/main/module'
], function(Router, Controller, Main) {


    App.on('main', function() {
        this.navigate('main');
        Controller.showMain()
    });

    return {
        router: new Router({controller: Controller}),
        controller: Controller,
        modules: {
            main: Main
        }
    }

});
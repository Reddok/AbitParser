define([
    'apps/regional/router/index',
    'apps/regional/controller/index',
    'apps/regional/modules/main/module',
    'apps/regional/modules/region/module',
    'apps/regional/modules/univer/module',
    'apps/regional/modules/spec/module',
], function(Router, Controller, Main, Region, Univer, Spec) {

    App.on('regions:list', function() {
        this.navigate('regions');
        Controller.showMain();
    });

    App.on('univers:list', function(id) {
        this.navigate('regions/' + id);
        Controller.showRegion(id);
    });

    App.on('specs:list', function(id) {
        this.navigate('univers/' + id);
        Controller.showUniver(id)
    });


    App.on('students:list', function(id) {
        this.navigate('specs/' + id);
        Controller.showSpec(id)
    });

    App.on('student:show', function(id) {
        this.navigate('students/' + id);
        Controller.showStudent(id)
    });


    return {
        router: new Router({controller: Controller}),
        controller: Controller,
        modules: {
            main: Main,
            region: Region,
            univer: Univer,
            spec: Spec
        }
    }

});
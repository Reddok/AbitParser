define([
    'apps/search/router/index',
    'apps/search/controller/index',
    'apps/search/modules/search/module'
], function(Router, Controller, Search) {

    var serializeParams = function(options) {
        options = _.pick(options, "pattern", 'page');
        return (_.map(_.filter(_.pairs(options), function(pair) { return pair[1] }), function(pair) {
            return pair.join(':');
        })).join('+');
    };


    App.on('search', function() {
        this.navigate('search/');
        Controller.showSearch();
    });

    App.on('search:page:change', function(options) {
        this.navigate('search/' + serializeParams(options));
    });

    return {
        router: new Router({controller: Controller}),
        controller: Controller,
        modules: {
            search: Search
        }
    }

});
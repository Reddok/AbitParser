define([
    'apps/search/modules/search/module',
], function(Search) {

    return {
        showSearch: function(options) {
            Search.controller.show(options);
            App.trigger("set:active:header", "search");
        }
    };

});
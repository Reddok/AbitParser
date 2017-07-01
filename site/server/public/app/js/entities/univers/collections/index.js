define([
    'backbone',
    'entities/univers/models/index'
], function (Backbone, UniverModel) {
    'use strict';

    return Backbone.Collection.extend({
        model: UniverModel,
        url: '/univers',
        comparator: function(a, b) {
            return b.get("children") - a.get("children");
        }
    });
});
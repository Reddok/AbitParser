define([
    'backbone',
    'entities/specs/models/index'
], function (Backbone, SpecModel) {
    'use strict';

    return Backbone.Collection.extend({
        model: SpecModel,
        url: '/specs',
        comparator: function(a, b) {
            if(a.get("specType") !== b.get("specType")) return a.get("specType") === "denna"? -1 : 1;
            return b.get('children') > a.get('children')? 1 : -1;
        }
    });
});
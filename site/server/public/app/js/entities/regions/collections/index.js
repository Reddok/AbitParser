define([
    'backbone',
    'entities/regions/models/index'
], function (Backbone, RegionModel) {
    'use strict';

    return Backbone.Collection.extend({
        model: RegionModel,
        url: '/regions',
        comparator: 'name'
    });
});
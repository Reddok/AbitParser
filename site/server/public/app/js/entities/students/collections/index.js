define([
    'backbone',
    'entities/students/models/index',
], function (Backbone, StudentModel) {
    'use strict';

    return Backbone.Collection.extend({
        model: StudentModel,
        url: '/students',
        comparator: function(a, b) {
            return a.get("statement").place - b.get("statement").place;
        }
    });
});
define([
    'backbone',
    'entities/students/models/index',
    'paginator'
], function (Backbone, StudentModel) {
    'use strict';

    var Students =  Backbone.PageableCollection.extend({
        model: StudentModel,
        url: '/students/search',
        comparator: 'name',
        mode: 'server',

        initialize: function(models, parameters) {

            var params = parameters? parameters.page? parameters : _.extend(parameters, {page: 1}) : {page: 1},
                self = this;

            this.parameters  = new Backbone.Model(params);

            this.listenTo(this.parameters, 'change', function() {
                self.trigger('page:change:before');
                self.getPage(parseInt(self.parameters.get('page')), {error: function(coll, err) {
                    self.trigger("load:error", err);
                }});
            });

            this.on('sync', self.trigger.bind(self, 'page:change:after'));

        },

        state: {
            firstPage: 1,
            currentPage: 1,
            pageSize: 10
        },

        queryParams: {
            pattern: function() { return this.parameters.get("pattern")},
            year: function() { return this.parameters.get("year") }
        }
    });


    _.extend(Students.prototype, {
        parseState: function(resp) {
            return {totalRecords: resp.initialLength};
        },

        parseRecords: function(resp) {
            return resp.records;
        }
    });

    return Students;
});
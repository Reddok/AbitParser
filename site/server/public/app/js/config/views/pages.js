define(['marionette', 'tpl!config/templates/pages.tpl'], function(Marionette, ControlsTpl) {

    return Marionette.View.extend({

        template: ControlsTpl,
        className: 'pagination-wrap',

        events: {
            'click a.navigatable': 'goToPage'
        },

        initialize: function(options) {

            this.paginatedCollection = options.paginatedCollection;
            this.urlBase = options.urlBase;

            if(options.classes) this.$el.addClass(options.classes);
            this.listenTo(this.paginatedCollection, 'page:change:after', this.render);

        },

        goToPage: function(e) {
            var page = parseInt($(e.target).closest('a').data('page'), 10);
            this.trigger('page:change', page);
            return false;
        },

        serializeData: function() {
            var data = this.paginatedCollection.state,
                url = this.urlBase;
            data.pageSet = _.range(Math.max(data.currentPage - 2, 1), Math.min(data.currentPage + 2, data.lastPage) + 1);
            data.previousPage = Math.max(data.currentPage - 1, 1);
            data.nextPage = Math.min(data.currentPage + 1, data.lastPage);

            if(url) url += "/page:";
            data.urlBase = url;

            return data;
        }

    })

});
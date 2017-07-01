define([
    'underscore',
    'marionette',
    'tpl!config/templates/paginated.tpl',
    'config/views/pages'], function(_, Marionette, paginatedTpl, ControlsView) {

    return Marionette.View.extend({

        template: paginatedTpl,
        regions: {
            controls: '.js-pagination-controls',
            content: '.js-pagination-main'
        },

        initialize: function(options) {

            var self = this,
                eventsToPropagate = options.propagatedEvents || [],
                ActualControlsView = options.controlsView || ControlsView,
                controls, mainView;

            this.collection = options.collection;

            controls = new ActualControlsView({
                paginatedCollection: this.collection,
                urlBase: options.paginatedUrlBase
            });

            mainView = new options.mainView({collection: this.collection});

            _.each(eventsToPropagate, function(evt) {
                self.listenTo(mainView, evt, function(view, model) {
                    console.log("ölolol");
                    self.trigger(evt, view, model);
                });
            });

            this.listenTo(controls, 'page:change', this.trigger.bind(this, 'page:change'));

            this.onRender = function() {
                this.showChildView('controls', controls);
                this.showChildView('content', mainView);
            };


        }

    })


});
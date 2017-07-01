define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'backbone.radio',
    'config/staticMap',
    'bootstrap'
], function($, _, Backbone, Marionette, Radio, staticMapFactory) {

    return Marionette.Application.extend({

        initialize: function(channelName) {
            this.channel =  Radio.channel(channelName || 'main')
        },

        onBeforeStart: function(app, options) {
            _.templateSettings = {
                interpolate: /\{\{=(.+?)\}\}/g,
                escape: /\{\{-(.+?)\}\}/g,
                evaluate: /\{\{(.+?)\}\}/g
            };

            this.options = options;
            console.log("options", this.options);

            /*Це написано для підтримки хелперів для шаблонів. В версії 2.0 вони підтримувались самі по собі, але тут в мене чомусь не робило
             а в документації я нічого не знайшов*/

            _.extend(Marionette.View.prototype, {

                origMixTemplateContext: Marionette.View.prototype.mixinTemplateContext,
                mixinTemplateContext: function(data){
                    return this.origMixTemplateContext(_.extend({}, this.templateHelpers, data));
                },
                templateHelpers: {
                    staticMap : staticMapFactory(this.options.baseUrl)
                }

            });
        },

        onStart: function() {
            var self = this;

            require([
                'appView',
                'apps/menu/app',
                'apps/main/app',
                'apps/search/app',
                'apps/regional/app',
                'apps/footer/app'
            ], function(AppView, Menu, Main, Search, Regional, Footer) {


                self.regions = new AppView().render();
                self.trigger('menu:get');
                self.trigger('footer:get', self.options.lastUpdated);

                self.Menu = Menu;
                self.Main = Main;
                self.Search = Search;
                self.Regional = Regional;
                self.Footer = Footer;


                Backbone.history.start();
                if(self.getCurrentRoute() === "") self.trigger("search")

            });

        },

        getCurrentRoute: function() {
            return Backbone.history.fragment;
        },

        navigate: function(route, options) {
            options || (options = {});
            Backbone.history.navigate(route, options);
        }
    });

});
define([
    'underscore',
    'marionette',
    'apps/regional/modules/layout/module',
    'apps/regional/modules/main/module',
    'apps/regional/modules/region/module',
    'apps/regional/modules/univer/module',
    'apps/regional/modules/spec/module',
    'apps/regional/modules/student/module'
], function(_, Marionette, Layout, Main, Region, Univer, Spec, Student) {

    return {

        showView: function(query, childShow) {
            return Layout.controller.show(query, childShow);
        },

        showMain: function() {
            this.showView({}, Main.controller.show);
            App.trigger("set:active:header", "regional");
        },

        showRegion: function(id) {
            this.showView({region: id}, _.bind(Region.controller.show, Region.controller, id));
            App.trigger("set:active:header", "regional");
        },


        showUniver: function(id) {
            this.showView({univer: id}, _.bind(Univer.controller.show, Univer.controller, id));
            App.trigger("set:active:header", "regional");
        },


        showSpec: function(id) {
            this.showView({spec: id}, _.bind(Spec.controller.show, Spec.controller, id));
            App.trigger("set:active:header", "regional");
        },

        showStudent: function(id) {
            Student.controller.show(id);
        }
    };

});
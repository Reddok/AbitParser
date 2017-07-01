define(['marionette', 'tpl!apps/regional/modules/main/templates/layout.tpl'], function(Marionette, LayoutTpl) {

    return Marionette.View.extend({
        initialize: function() {
            this.title = "Регіони";
        },

        template: LayoutTpl,
        regions: {
            'regions': '#regions-wrap'
        }

    });

});
define(['marionette', 'tpl!apps/regional/modules/region/templates/layout.tpl'], function(Marionette, LayoutTpl) {

    return Marionette.View.extend({
        initialize: function() {
            this.title = "Регіон: " + this.model.get("name");
        },
        template: LayoutTpl,
        regions: {
            'univers': '#univers-wrap'
        }

    });

});
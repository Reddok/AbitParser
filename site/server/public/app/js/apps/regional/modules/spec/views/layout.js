define(['marionette', 'tpl!apps/regional/modules/spec/templates/layout.tpl'], function(Marionette, LayoutTpl) {

    return Marionette.View.extend({
        initialize: function() {
            this.title = "Спеціальність: " + this.model.get("name");
        },
        template: LayoutTpl,
        regions: {
            'students': '#students-wrap'
        }

    });

});
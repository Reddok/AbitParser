define(['marionette', 'tpl!apps/regional/modules/univer/templates/layout.tpl'], function(Marionette, LayoutTpl) {

    return Marionette.View.extend({
        initialize: function() {
          this.title = "Університет: " + this.model.get("name");
        },
        template: LayoutTpl,
        regions: {
            'specs': '#specs-wrap'
        }

    });

});
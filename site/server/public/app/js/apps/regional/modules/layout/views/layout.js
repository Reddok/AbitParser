define(["marionette", "tpl!apps/regional/modules/layout/templates/layout.tpl"], function(Marionette, LayoutTpl) {


    return Marionette.View.extend({

        initialize: function() {
          this.parameters = {title: null};
        },
        template: LayoutTpl,
        regions: {
            breadcrumb: "#breadcrumb-wrap",
            panel: "#panel-wrap",
            content: "#section"
        },
        serializeData: function() {
            return this.parameters;
        }

    });


});
define(["marionette", "tpl!apps/regional/common/templates/panel.tpl"], function(Marionette, PanelTpl) {

   return Marionette.View.extend({

       template: PanelTpl,

       ui: {
            input: "input[name=filter]"
       },

       events: {
           "submit #filterForm": "filterItems"
       },

       filterItems: function() {
            var criteria = this.getUI('input').val();
            this.trigger("items:filter", criteria);
            return false;
       }

   });

});
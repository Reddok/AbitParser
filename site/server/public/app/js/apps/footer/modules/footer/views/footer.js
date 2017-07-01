define(["marionette", "tpl!apps/footer/modules/footer/templates/footer.tpl"], function(Marionette, FooterTpl) {

   return Marionette.View.extend({

       template: FooterTpl,
       initialize: function(attributes) {
           this.lastUpdated = attributes.lastUpdated;
       },

       serializeData: function() {
           return {lastUpdated: this.lastUpdated}
       }
   })

});
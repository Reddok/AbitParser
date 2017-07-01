define(["underscore", "marionette", "tpl!config/templates/error.tpl"], function(_, Marionette, ErrorTpl) {

   return Marionette.View.extend({
        template: ErrorTpl
   });

});
define(['marionette', 'tpl!apps/main/modules/main/templates/layout.tpl'], function(Marionette, LayoutTpl) {

    return Marionette.View.extend({
        template: LayoutTpl
    });

});
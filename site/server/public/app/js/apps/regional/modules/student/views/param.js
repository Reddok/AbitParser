define(['marionette', 'tpl!apps/regional/modules/student/templates/param.tpl'], function(Marionette, ItemTpl) {

    return Marionette.View.extend({

        tagName: 'tr',
        template: ItemTpl

    });

});
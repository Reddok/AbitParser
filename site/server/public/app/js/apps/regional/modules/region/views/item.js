define(['marionette', 'tpl!apps/regional/modules/region/templates/item.tpl'], function(Marionette, ItemTpl) {

    return Marionette.View.extend({

        tagName: 'tr',
        template: ItemTpl,

        triggers: {
            'click': 'univer:show'
        }

    });

});
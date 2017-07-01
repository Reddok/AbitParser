define(['marionette', 'tpl!apps/regional/modules/univer/templates/item.tpl'], function(Marionette, ItemTpl) {

    return Marionette.View.extend({

        tagName: 'tr',
        template: ItemTpl,

        triggers: {
            'click': 'spec:show'
        }

    });

});
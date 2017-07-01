define(['marionette', 'tpl!apps/regional/modules/main/templates/item.tpl'], function(Marionette, ItemTpl) {

    return Marionette.View.extend({

        tagName: 'li',
        template: ItemTpl,

        triggers: {
            'click a': 'region:show'
        }

    });

});
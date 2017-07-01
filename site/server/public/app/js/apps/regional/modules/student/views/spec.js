define(['marionette', 'tpl!apps/regional/modules/student/templates/spec.tpl'], function(Marionette, ItemTpl) {

    return Marionette.View.extend({

        tagName: 'tr',
        template: ItemTpl,

        triggers: {
            'click': 'spec:show'
        }

    });

});
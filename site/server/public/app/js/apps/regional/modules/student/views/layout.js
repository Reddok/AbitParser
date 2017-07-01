define(['marionette', 'tpl!apps/regional/modules/student/templates/layout.tpl'], function(Marionette, LayoutTpl) {

    return Marionette.View.extend({

        template: LayoutTpl,
        regions: {
            'specs': '#specs-wrap',
            'params': '#params-wrap'
        }

    });

});
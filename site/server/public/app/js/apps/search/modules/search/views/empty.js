define(['marionette', 'tpl!apps/search/modules/search/templates/empty.tpl'], function(Marionette, EmptyTpl) {

    return Marionette.View.extend({
        tagName: "li",
        className: "col-empty",
        template: EmptyTpl
    });

});
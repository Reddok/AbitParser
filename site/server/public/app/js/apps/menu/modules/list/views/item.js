define([
    'marionette',
    'tpl!apps/menu/modules/list/templates/item.tpl'
], function(Marionette, itemTpl) {

    return Marionette.View.extend({
        template: itemTpl,
        tagName: 'li',

        modelEvents: {
            "selected": "activate",
            "deselected": "deactivate"
        },

        triggers: {
            'click a': 'navigate'
        },

        onRender: function() {
            if(this.model.selected) this.activate();
        },

        activate: function() {
            this.$el.addClass("active");
        },

        deactivate: function() {
            this.$el.removeClass("active");
        }
    });

});
define([
    'marionette',
    "tpl!apps/menu/modules/list/templates/header.tpl"
], function(Marionette, MenuTpl) {

    return Marionette.View.extend({
        template: MenuTpl,
        regions: {
            "menu": "#navigation-menu"
        },
        childViewTriggers: {
            "navigate": "hide:menu"
        },

        ui: {
            menu: "#navigation-menu"
        },

        onHideMenu: function() {
            if(document.documentElement.clientWidth < 768) this.getUI("menu").collapse("hide");
        }
    });

});

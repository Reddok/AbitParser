define([
    'apps/main/modules/main/module',
], function(Main) {

    return {
        showMain: function() {
            Main.controller.show();
            App.trigger("set:active:header", "main");
        }
    };

});
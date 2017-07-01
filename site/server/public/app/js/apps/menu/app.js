define(['underscore', 'apps/menu/modules/list/module'], function(_, List) {


    App.on('menu:get', _.bind(List.Controller.listHeader, List.Controller));
    App.on('set:active:header', _.bind(List.Controller.setActiveHeader, List.Controller));

    return {
        modules:{
            List: List
        }
    }

});
define(['entities/menu/collections/index', 'config/entity', 'config/strategies'], function(MenuList, API, strategies) {

    var api = new API(strategies.collection, MenuList);

    api.getHeaders = function() {
        if(typeof App.headers === "undefined") {
           App.headers = api.init({
                initial: [
                    { name: 'Головна', url : "main" , navigationTrigger: "main"},
                    { name: 'Пошук', url: 'search', navigationTrigger: 'search'},
                    { name:  'Регіональний пошук', url : "regional" , navigationTrigger: "regions:list"}
                ]
            })
        }
        return App.headers;
    };

    App.channel.reply('menu:entities', api.getHeaders, api);

});
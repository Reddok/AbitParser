define([
    'entities/univers/models/index',
    'entities/univers/collections/index',
    'config/entity',
    'config/strategies'
], function(UniverModel, UniverCollection, API, strategies) {

    var univer = new API(strategies.model, UniverModel),
        univers = new API(strategies.collection, UniverCollection);

    App.channel.reply('univer:entity', univer.get, univer);
    App.channel.reply('univer:entities', univers.get, univers);

});
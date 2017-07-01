define([
    'entities/regions/models/index',
    'entities/regions/collections/index',
    'config/entity',
    'config/strategies'
], function(RegionModel, RegionCollection, API, strategies) {

    var region = new API(strategies.model, RegionModel),
        regions = new API(strategies.collection, RegionCollection);

    App.channel.reply('region:entity', region.get, region);
    App.channel.reply('region:entities', regions.get, regions);

});
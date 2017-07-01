define([
    'entities/location/models/index',
    'config/entity',
    'config/strategies'
], function(LocationModel, API, strategies) {

    var region = new API(strategies.model, LocationModel);

    App.channel.reply('location:current', region.get, region);

});
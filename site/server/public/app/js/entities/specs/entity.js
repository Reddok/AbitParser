define([
    'entities/specs/models/index',
    'entities/specs/collections/index',
    'config/entity',
    'config/strategies'
], function(SpecModel, SpecCollection, API, strategies) {

    var spec = new API(strategies.model, SpecModel),
        specs = new API(strategies.collection, SpecCollection);

    App.channel.reply('spec:entity', spec.get, spec);
    App.channel.reply('spec:entities', specs.get, specs);

});
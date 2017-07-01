define([
    'backbone',
    'entities/menu/models/index',
    'select'
], function(Backbone, Item) {

    return Backbone.Collection.extend({

        model: Item,

        initialize: function(models) {
            Backbone.Select.One.applyTo( this, models );
        }
    });

});
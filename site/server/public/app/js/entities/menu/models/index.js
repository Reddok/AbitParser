define(['backbone'], function(Backbone) {

    return Backbone.Model.extend({
        initialize: function() {
            Backbone.Select.Me.applyTo( this );
        }
    });

});
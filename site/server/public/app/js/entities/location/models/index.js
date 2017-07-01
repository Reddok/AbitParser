define(["backbone"], function(Backbone) {

    return Backbone.Model.extend({
        url: "/pathLocation",
        defaults: {
            region: false,
            univer: false,
            spec: false
        }
    });

});
define(["backbone", "config/views/error"], function(Backbone, ErrorView) {

    return function(err) {
        console.log("error", err);
        if(err.readyState) {
            err = new Error(err.responseJSON? err.responseJSON.message : err.responseText);
        }

        var errorModel = new Backbone.Model({message: err.message}),
            errorView = new ErrorView({model: errorModel});

        App.regions.showChildView('content', errorView);
    }

});
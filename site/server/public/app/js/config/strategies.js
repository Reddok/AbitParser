define([], function() {

    return {
        model: {
            load: simpleLoad
        },
        collection: {
            load: simpleLoad,
            initial: []
        },
        paged: {
            load: pagedLoad,
            initial: []
        }
    };

});

function simpleLoad(entity, options) {
    return entity.fetch(options);
}

function pagedLoad(entity, options) {
    return entity.getPage(entity.parameters.get('page') || 1, options);
}
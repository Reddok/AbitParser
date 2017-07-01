define([], function() {

    return function(baseUrl) {
        return function(name) {
            return baseUrl + name;
        }

    }

});
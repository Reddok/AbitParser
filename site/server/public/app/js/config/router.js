define(['underscore', 'marionette'], function(_, Marionette) {

    return Marionette.AppRouter.extend({

        execute: function(callback, args) {
            var params = args[0],
                query = args[1] || '',
                options = {};

                if(params){
                    if(params.indexOf(":") < 0) {
                        options = params;
                    } else {
                        if(params.trim() !== '') {
                            params = params.split('+');
                            _.each(params, function(param) {
                                var values = param.split(':');
                                if(values[1]) options[values[0]] = values[0] === 'page' ? parseInt(values[1], 10) : values[1];
                            })
                        }
                    }
                }

                _.defaults(options, { page: 1 });

                if(callback) callback.call(this, options);

        }
    });

});
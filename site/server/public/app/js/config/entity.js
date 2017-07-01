define(['jquery', 'underscore'], function($, _) {

    var API = function(strategy, entityClass){
        this.class = entityClass;
        this.strategy = strategy;
    };

    API.prototype.init = function(options) {
        options || (options = {});
        options.initial || (options.initial = this.strategy.initial || {});
        options.parameters || (options.parameters = {});
        return new this.class(options.initial, options.parameters);
    };

    API.prototype.new = function(options) {
        var entity = this.init(options);
        options.success && options.success(entity);
        return entity;
    };

    API.prototype.get = function(options) { /*Стандартний метод для отримання готового чогось(моделі, колекції і тд.) Повертає проміс.*/
        options || (options = {});
        var entity = this.init(options),
            defer, prom;

        defer = $.Deferred();
        defer.then(options.success, options.error);

        prom = this.load(entity, options);

        prom.done(function() {
            if(entity.length) console.log(entity.length);
            defer.resolve.apply(this, [entity]);
        });
        prom.fail(function() {
            defer.reject.apply(this, arguments);
        });

        return defer.promise();
    };

    API.prototype.load = function(entity, options) {
        options = _.omit(options, 'success', 'error', 'initial', 'parameters');
        return this.strategy.load(entity, options);
    };


    return API;

});
const fnArgs = require("parse-fn-args"),
    dependencies = [],
    factories = [];


module.exports = function() {

    return {

        register: (name, dependency) => {
            dependencies[name] = dependency;
        },

        factory: (name, fn) => {
            factories[name] = fn;
        },

        get: function (name) {
            if(!dependencies[name]) {
                dependencies[name] = factories[name] && this._inject(factories[name]);
                if(!dependencies[name]) throw new Error('Cannot find module: ' + name);
            }
            return dependencies[name];
        },

        _inject: function(fn) {
            let args = fnArgs(fn).map((arg) => this.get(arg));
            return fn.apply(null, args);
        }

    }


};
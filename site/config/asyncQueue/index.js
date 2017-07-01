'use strict';

const FreeState = require("./states/free"),
    BusyState = require("./states/busy");

class Config{

    constructor(strategy) {
        this.strategy = strategy;
        this.busyKeys = {};
        this.states = {
            free: new FreeState(this),
            busy: new BusyState(this)
        }
    }

    get(key, cb) {
        this._applyCommand('get', key, cb);
    }

    set(key, value, cb) {
        this._applyCommand('set', key, value, cb)
    }

    _applyCommand(command, key) {
        const activeState = this.busyKeys[key]? this.states.busy : this.states.free,
            lastArg = arguments[arguments.length - 1];
        let cb;

        if(typeof lastArg === "function") cb = lastArg;
        if(!activeState[command]) cb && cb(new Error("unrecognized command"));
        activeState[command].apply(activeState, Array.prototype.slice.call(arguments, 1));
    }


}

module.exports = Config;
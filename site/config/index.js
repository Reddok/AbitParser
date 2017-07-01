'use strict';

const config = require("./nconf"),
    pify = require('pify'),
    AsyncProxy = require('./asyncQueue'),
    configProxy = new AsyncProxy(config);

module.exports = {
    get: pify(configProxy.get.bind(configProxy)),
    set: pify(configProxy.set.bind(configProxy))
};
'use strict';

let path = require('path'),
    util = require('util');

function ServerError(err){
    Error.apply(this, arguments);
    Error.captureStackTrace(this, ServerError);
    this.message = err.message || 'Error';
    this.errorStack = err.stack;
}

util.inherits(ServerError, Error);

ServerError.prototype.name = 'Server Error';

module.exports = ServerError;
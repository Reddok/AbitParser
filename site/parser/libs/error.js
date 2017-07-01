'use strict';

let path = require('path'),
    util = require('util');

function ParserError(message, stack){
    Error.apply(this, arguments);

    if(stack) {
        this.stack = stack;
    } else {
        Error.captureStackTrace(this, ParserError);
    }

    this.message = message || 'Unrecognized parser error.';
}

util.inherits(ParserError, Error);

ParserError.prototype.name = 'Parser Error';

module.exports = ParserError;
'use strict';

let path = require('path'),
    util = require('util');

function DatabaseError(message){
    Error.apply(this, arguments);
    Error.captureStackTrace(this, DatabaseError);

    this.message = message || 'Error';
}

util.inherits(DatabaseError,  Error);

DatabaseError.prototype.name = 'Database Error';

module.exports = DatabaseError;
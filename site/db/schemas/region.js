'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schema = new Schema({
        _id: {
            type: Number
        },
        name: {
            type: String,
            required: true,
            index: true
        },
        parsed_id: {
            type: String
        }
    }, { retainKeyOrder: true });

module.exports = schema;
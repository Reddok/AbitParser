'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schema = new Schema({
       _id: {
            type: Number
        },
        name: {
            type: String,
            required: true
        },
        parsed_id: {
            type: String
        },
        parent: {
            type: String
        }
    }, { retainKeyOrder: true });

schema.index({parent: 1, name: 1});


module.exports = schema;
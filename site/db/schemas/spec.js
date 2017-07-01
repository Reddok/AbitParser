'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    schema = new Schema({
       _id: {
            type: Number
        },
        name: {
            type: String,
            required: true
        },
        specType: {
            type: String,
            required: true
        },
        parsed_id: {
            type: String,
            required: true
        },
        concurs: {
            type: Number,
            required: true
        },
        places: {
            type: Number,
            required: true
        },
        parent: {
            type: String,
            required: true
        }
    }, { retainKeyOrder: true });

schema.index({name: 1, specType: 1});
schema.index({parent: 1, name: 1});
schema.index({parsed_id: 1, name: 1});

module.exports = schema;
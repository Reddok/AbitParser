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
            index: true,
            unique: true
        },
         enrolled: {
            type: String
         },
         _garbage: String,
        statements: [{
            rank: {
                type: String,
                required: true
            },
            place: {
                type: Number,
                required: true
            },
            znoPoints: {
                type: String,
                required: true
            },
            spec: {
                type: String,
                required: true
            }

        }]
    }, {retainKeyOrder: true});

schema.index({"statements.spec": 1, name: 1});

module.exports = schema;
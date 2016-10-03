/**
 * Created by TUNGTRAN on 8/24/2015.
 */
'use strict;'

/*
* Modules dependencies
* */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*
* Categories Schema
* */
var CategoriesSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true,
        required: 'Name cannot be blank.'
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('Categories', CategoriesSchema);
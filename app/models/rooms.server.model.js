/**
 * Created by TUNGTRAN on 8/24/2015.
 */
'use strict;'
/*
* Modules dependencies*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoomsSchema = new Schema({
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
    category: {
        type: Schema.ObjectId,
        ref: 'Categories'
    }
});
mongoose.model('Rooms', RoomsSchema);
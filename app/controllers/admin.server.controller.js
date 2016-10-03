'use strict';

var _ = require ('lodash'),
    errorHandler = require('./errors.server.controller'),
    mongoose = require('mongoose'),
    user  = mongoose.model('User');

exports.index = function(req, res){
    res.render('admin', {
        user: req.user || null,
        request: req
    });
};
/*
* Get all users
* */
exports.listUsers = function(req, res){
    user.find().exec(function(err, users){
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }else{
            res.json(users);
        }
    });
};


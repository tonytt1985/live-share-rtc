/**
 * Created by TUNGTRAN on 8/24/2015.
 */
'use strict;'
/*
* Modules dependencies
* */

var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Categories = mongoose.model('Categories'),
    _ = require('lodash');

exports.create = function(req, res){
    var category = new Categories(req.body);
    category.save(function(err){
        if(err)
            return res.status(400).send({message: errorHandler.getErrorMessage(err)});
        else
            res.json(category);
    });
};

exports.update = function(req, res){
    var category = req.category;
    category = _.extend(category, req.body);
    category.save(function(err){
        if(err)
            return res.status(400).send({message:errorHandler.getErrorMessage(err)});
        else
            res.json(category);
    })
};

exports.delete = function(req, res){
    var category = new Categories(req.category);
    category.remove(function(err){
        if(err)
            return res.status(400).send({message:errorHandler.getErrorMessage(err)});
        else
            res.json(category);
    });
}

exports.list = function(req, res){
    Categories.find().sort('-created').exec(function(err, categories){
        if(err)
            return res.status(400).send({message: errorHandler.getErrorMessage(err)});
        else
            res.json(categories);
    });
};

exports.read = function(req, res){
    res.json(req.category);
};

exports.categoryById = function(req, res, next, id){
    Categories.findById(id).exec(function(err, category){
        if(err) return next(err);
        if(!category) return next(new Error('Fail to load category ' + id));
        req.category = category;
        next();
    });
};
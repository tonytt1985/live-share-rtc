/**
 * Created by TUNGTRAN on 8/24/2015.
 */

var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Rooms = mongoose.model('Rooms'),
    _ = require('lodash');

exports.create = function(req, res){
    var room = new Rooms(req.body);
    room.save(function(err){
        if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
        else res.json(room);
    });
}

exports.update = function(req, res){
    var room = req.room;
    room = _.extend(room, req.body);
    room.save(function(err){
        if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
        else res.json(room);
    });
};

exports.read = function(req, res){
    res.json(req.room);
};

exports.delete = function(req, res){
    var room = new Rooms(req.room);
    room.remove(function(err){
        if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
        else res.json(room);
    });
};

exports.list = function(req, res){
    Rooms.find().sort('-created').populate('category', 'name').exec(function(err, rooms){
        if(err) return res.status(400).send({message: errorHandler.getErrorMessage(err)});
        else res.json(rooms)
    });

};
exports.listByCategory = function(req, res){
    res.json(req.rooms);
}

exports.roomsByCategory= function(req, res, next, id){
    Rooms.find({category: id}).exec(function(err, rooms){
        if(err)
            return next(err);
        if(!rooms) return next(new Error('There is no room in catefory' + id));
        req.rooms = rooms;
        next();
    });
}

exports.roomById = function(req, res, next, id){
    Rooms.findById(id).populate('category', 'name').exec(function(err, room){
        if(err) return next(err);
        if(!room) return next(new Error('Fail to load room ' + id));
        req.room = room;
        next();
    });
};

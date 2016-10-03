/**
 * Created by TUNGTRAN on 8/20/2015.
 */

var mongoose = require('mongoose'),
    errorHandler = require('../controllers/errors.server.controller'),
    Rooms = mongoose.model('Rooms'),
    _ = require('lodash');

/*function room(room){
   this.data = room;
    this.listUsers = [];
    this.addUser = function(user){
        this.listUsers.push(user);
    }
    this.getListUsers = function(){
        return this.listUsers;
    };
    this.removeUser = function(user){
        this.listUsers.splice(this.listUsers.indexOf(user), 1);
    }
    this.hadUser = function(user){
        return this.listUsers.indexOf(user);
    }
    this.getRoomId = function(){
        return this.data._id;
    }
}*/

function roomsMngt(){
    this.listRooms = {};
    /*this.findRoom = function(id){
        for(var i in this.listRooms){
            if(this.listRooms[i].data._id = id)
                return this.listRooms[i];
        }
        return false;
    }*/
};

roomsMngt.prototype.init = function(){
    var _this = this;
    Rooms.find().sort('-created').exec(function(err, rooms){
        if(err) {
            console.log(errorHandler.getErrorMessage(err));
        }
        else{
            for(var i in rooms)
                _this.listRooms[rooms[i]._id] = [];
        }
    });
}

roomsMngt.prototype.getListRooms = function(){
    return this.listRooms;
}

roomsMngt.prototype.addUserToRoom = function(id, user){
   this.listRooms[id].push(user)
};

roomsMngt.prototype.removeUserFromRoom = function(id, user){
    for(var j in this.listRooms[id]){
        if(this.listRooms[id][j]._id === user._id){
            this.listRooms[id].splice(j, 1);
            return ;
        }
    }
}

roomsMngt.prototype.getListUserInRoom = function(roomId){
    if(this.listRooms[roomId]){
        return this.listRooms[roomId];
    }
    return false;
};

roomsMngt.prototype.findRoomOfUser = function(user){
    for(var i in this.listRooms){
        for(var j in this.listRooms[i]){
            if(this.listRooms[i][j]._id === user._id)
                return i;
        }
    }
    return false;
};
roomsMngt.prototype.removeUserDisconnectedFromRoom = function(id, user){
    for(var j in this.listRooms[id]){
        if(this.listRooms[id][j]._id === user._id && this.listRooms[id][j].socketId === user.socketId){
            this.listRooms[id].splice(j, 1);
            return true;
        }
    }
    return false;
}
roomsMngt.prototype.getUserInRoom = function(id, userId){
    for(var i in this.listRooms[id]){
        if(this.listRooms[id][i]._id === userId)
            return this.listRooms[id][i];
    }
    return false;
}
module.exports = roomsMngt;
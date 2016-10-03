/**
 * Created by TUNGTRAN on 8/20/2015.
 */
//
//This module use to manage users in webapp


function user(socketId){
    this.socketId = socketId;
    this.id;
}
user.prototype.setSocketId = function(socketId){
    this.socketId = socketId;
}
user.prototype.setId = function(id){
    this.id = id;
}


function userMngt(){
    this.listUsers = [];
}

userMngt.prototype.addUser = function(user){

}

userMngt.prototype.findUserBySocketId = function(socketId){

}

userMngt.prototype.findUserById = function(id){

}
'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk'),
    http = require('http'),
    circularJson = require('circular-json');


/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);



// Expose app
exports = module.exports = app;

var server = http.createServer(app);
server.listen(3001);
//Init socket.io
global.socketio = require('./app/connection/socketio.js');
socketio.io.listen(server);
console.log('MEAN.JS application started on port ' + config.port);
global.roomsMngt = new (require('./app/connection/rooms.management'))();
roomsMngt.init();
var userOnline = [];
var publicRoom = "public";
//Let's start managing connections
socketio.io.sockets.on('connection', function(socket){
    socket.on('join', function(room){
        if(!room)
            socket.join(publicRoom);
        else
            socket.join(room);
    });
    socket.on('message', function(message){
        if(message.room === message.sendTo)
            socket.broadcast.to(message.room).emit('message', message);
        else{
            var user = roomsMngt.getUserInRoom(message.room, message.sendTo);
            if(user)
                socketio.io.to(user.socketId).emit('message', message);
        }
    });
    socket.on('joinRoom', function(message){
        socket.user = message.user;
        socket.roomId = message.roomId;
        //Check old room of user
        var checkRoom = roomsMngt.findRoomOfUser(message.user);
        if(checkRoom){
            roomsMngt.removeUserFromRoom(checkRoom, message.user);
            socketio.io.to(checkRoom).emit('userLeftRoom', {user: message.user});
        }
        //Socket join room
        socket.join(message.roomId);
        //add socket id to user
        message.user.socketId = socket.id;
        //Add user to room
        roomsMngt.addUserToRoom(message.roomId, message.user);
        socket.broadcast.to(message.roomId).emit('userJoinedRoom', {user: message.user});
        socket.emit('joinedRoom', {listUsers: roomsMngt.getListUserInRoom(message.roomId)});
    });
    socket.on('leaveRoom', function(message){
        var checkRoom = roomsMngt.findRoomOfUser(message.user);
        if(checkRoom){
            roomsMngt.removeUserFromRoom(checkRoom, message.user);
            socketio.io.to(checkRoom).emit('userLeftRoom', {user: message.user});
        }
    });
    socket.on('disconnect', function(){
        if(socket.user){
            socket.user.socketId = socket.id;
            var checkRoom = roomsMngt.findRoomOfUser(socket.user);
            if(checkRoom && checkRoom == socket.roomId){
                if(roomsMngt.removeUserDisconnectedFromRoom(checkRoom, socket.user))
                    socketio.io.to(checkRoom).emit('userLeftRoom', {user: socket.user});
            }
        }
    });
    socket.on('privateCall', function(message){
        var user = roomsMngt.getUserInRoom(message.room, message.to);
        if(user)
            socketio.io.to(user.socketId).emit('privateCall', message);
    });
    socket.on('privateCallReady', function(message){
        socket.emit('privateCallReady', message);
    });
    socket.on('msg', function(message){
        var user = roomsMngt.getUserInRoom(message.room, message.to);
        console.log(message.by +'&&' +message.to+ '&&' + message.type);
        if(user)
            socketio.io.to(user.socketId).emit('msg', message);
    });
});
'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk'),
    http = require('http');

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
var io = require('socket.io')(server);

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
var rooms = [];
//Let's start managing connections
io.sockets.on('connection', function(socket){

    //Hanlde 'message' messages
    socket.on('message', function(message){
        log('S --> Got message: ', message.message);
        socket.broadcast.to(message.channel).emit('message', message.message);
    });

    //Handle  'create or join' messages
    socket.on('create or join', function(channel){
        var numClients = 0
        if(rooms[channel] != undefined)
            numClients = rooms[channel].length ;
        log('numClients: ', numClients);
        //First client joining ...
        if(numClients == 0){
            socket.join(channel);
            rooms[channel]= [];
            rooms[channel].push(socket.id);
            socket.emit('created', channel);
        }//Second client joining .....
        else if(numClients == 1){
            //Inform initiator ...
            io.sockets.in(channel).emit('join', channel);
            //Let the new peer join channel
            socket.join(channel);
            rooms[channel].push(socket.id);
            socket.emit('joined', channel);
        }else{ //max two clients
            console.log('Channel full!');
            socket.emit('full', channel);
        }
    });

    //Handle 'response' messages
    socket.on('response', function(response){
        log('S --> Got response: ', response);

        //Just forward message to the other peer
        socket.broadcast.to(response.channel).emit('response',response.message);
    });

    //Handle 'Bye' message
    socket.on('Bye', function(channel){
        // Notify other peer
        socket.broadcast.to(channel).emit('Bye');

        //Close socket from server's side
        socket.disconnect();
    });

    //Handle 'Ack' messages
    socket.on('Ack', function(){
        console.log('Got an Ack!');
        //Close socket from server's side
        socket.disconnect();
    });

    //Utility function used for remote logging
    function log(){
        var array = [">>> "];
        for(var i = 0; i < arguments.length; i++){
            array.push(arguments[i]);
        }
        socket.emit('log', array);
    }
});
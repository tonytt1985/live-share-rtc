/**
 * Created by TUNGTRAN on 8/11/2015.
 */
'user strict;'
angular.module('core').factory('socket', ['socketFactory', function(socketFactory){
    var socket =  io.connect('http://'+ location.hostname +':3001',{
        'connect timeout' : 10000,
        'reconnection delay': 5000,
        'reconnection limit': 5000,
        'max reconnection attempts': 30,
        'sync disconnect on unload': true	//not firing disconnect event on unload page
    });
    socket.on('connect', function(){

    });
    socket.on('disconnect', function(){

    });
    return socketFactory({
        prefix: '',
        ioSocket: socket
    });
}]);
/**
 * Created by TUNGTRAN on 8/20/2015.
 */
var until = require('util');

exports.io = require('socket.io')({
    'match origin protocol': true,
    'log level': 2,
    'transports': ['websocket','xhr-polling','htmlfile','jsonp-polling'],
    'heartbeat timeout': 30,
    'heartbeat interval': 10,
    'browser public minification': true,
    'browser public etag': true,
    'browser public gzip': true
});
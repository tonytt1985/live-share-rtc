/**
 * Created by TUNGTRAN on 8/31/2015.
 */
'use strict;'
var users = require('../../app/controllers/users.server.controller');
var rooms = require('../../app/controllers/rooms.server.controller');

module.exports = function(app){
    app.route('/rooms').get(rooms.list)
        .post(users.requiresLogin, users.hasAuthorization(['admin']) ,rooms.create);
    app.route('/roomsByCategory/:categoryId').get(rooms.listByCategory);
    app.param('categoryId', rooms.roomsByCategory);
    app.route('/rooms/:roomId').get(users.requiresLogin, rooms.read)
        .put(users.requiresLogin, users.hasAuthorization(['admin']), rooms.update)
        .delete(users.requiresLogin, users.hasAuthorization(['admin']), rooms.delete);
    app.param('roomId', rooms.roomById);
};

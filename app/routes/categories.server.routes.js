/**
 * Created by TUNGTRAN on 8/26/2015.
 */
'use strict;'
/*
* Modules dependencies
* */
var users = require('../../app/controllers/users.server.controller');
var categories = require('../../app/controllers/categories.server.controller');

module.exports = function(app){
    app.route('/categories').get(categories.list)
        .post(users.requiresLogin, users.hasAuthorization(['admin']) ,categories.create);

    app.route('/categories/:categoryId').get(users.requiresLogin, users.hasAuthorization(['admin']), categories.read)
        .put(users.requiresLogin, users.hasAuthorization(['admin']), categories.update)
        .delete(users.requiresLogin, users.hasAuthorization(['admin']), categories.delete);
    app.param('categoryId', categories.categoryById);
};
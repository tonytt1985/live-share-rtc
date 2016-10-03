'use strict';
var config = require('./../../config/config'), _ = require('lodash');
module.exports = function(app) {
	// Root routing
    
	var core = require('../../app/controllers/core.server.controller');

	app.route('/').get(core.index);
};
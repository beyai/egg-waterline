'use strict';
const WaterLine = require('./lib/waterline.js');

module.exports = app => {
	if (app.config.waterline.agent) WaterLine(app);
};

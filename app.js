'use strict';

const Homey = require('homey');

class SchneiderApp extends Homey.App {
	
	onInit() {
		this.log('Schneider Electric App is running...');
	}
	
}

module.exports = SchneiderApp;
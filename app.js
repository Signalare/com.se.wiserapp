'use strict';

const Homey = require('homey');

class Wiser extends Homey.App {
	
	onInit() {
		this.log('Schneider Electric Wiser app is running...');
	}
	
}

module.exports = Wiser;
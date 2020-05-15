'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class ZW_MTN506004 extends ZwaveDevice {
	
	onMeshInit() {

	    // this.enableDebug();
        // this.printNode();

        this.log('Schneider 4ch Binary Sensor & Radio transmitter (MTN506004) has been inited');

    }

}

module.exports = ZW_MTN506004;
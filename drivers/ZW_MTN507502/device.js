'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class ZW_MTN507502 extends ZwaveDevice {
	
	onMeshInit() {

	    // this.enableDebug();
        // this.printNode();

        this.registerCapability('onoff', 'SWITCH_BINARY');

        this.log('Schneider 2ch Switch (MTN507502) has been inited');

    }

}

module.exports = ZW_MTN507502;
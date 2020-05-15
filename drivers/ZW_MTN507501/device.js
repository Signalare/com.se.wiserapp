'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class ZW_MTN507501 extends ZwaveDevice {
	
	onMeshInit() {

	    // this.enableDebug();
        // this.printNode();

        this.registerCapability('onoff', 'SWITCH_BINARY');

        this.log('Schneider 1ch Switch (MTN507501) has been inited');

    }

}

module.exports = ZW_MTN507501;
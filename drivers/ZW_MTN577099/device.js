'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class ZW_MTN577099 extends ZwaveDevice {
	
	onMeshInit() {

	    // this.enableDebug();
        // this.printNode();

        // Code from TED should go here and in the driver, settings and perhaps flow files..

    }

}

module.exports = ZW_MTN577099;
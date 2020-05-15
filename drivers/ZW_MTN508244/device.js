'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class ZW_MTN508244 extends ZwaveDevice {
	
	onMeshInit() {

	    // this.enableDebug();
        // this.printNode();

        this.registerCapability('dim', 'SWITCH_MULTILEVEL');

        this.log('Schneider Connect Move (MTN508244) has been inited');

    }

}

module.exports = ZW_MTN508244;
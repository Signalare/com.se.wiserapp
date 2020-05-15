'use strict';

const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class ZW_WDE00x903 extends ZwaveDevice {
	
	onMeshInit() {

	    // this.enableDebug();
        // this.printNode();

        this.registerCapability('onoff', 'BASIC');
        this.registerCapability('dim', 'SWITCH_MULTILEVEL');

        this.log('Schneider Double Push Buttons (WDE00x903) has been inited');

    }

}

module.exports = ZW_WDE00x903;
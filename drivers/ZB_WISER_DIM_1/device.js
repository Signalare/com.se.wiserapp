'use strict';

const Homey = require('homey');
const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');

class Wiser_Dimmer_1 extends ZigBeeDevice {

    async onNodeInit({zclNode}) {
        this.printNode();
        this.registerCapability('onoff', CLUSTER.ON_OFF);
        this.registerCapability('dim', CLUSTER.LEVEL_CONTROL);
    }

    onDeleted(){
		this.log("1 Gang Dimmer removed")
	}

}

module.exports = Wiser_Dimmer_1;

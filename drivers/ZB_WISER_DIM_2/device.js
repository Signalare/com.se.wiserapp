'use strict';

const Homey = require('homey');
const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');

class Wiser_Dimmer_2 extends ZigBeeDevice {

    async onNodeInit({zclNode}) {


        this.printNode();

        const { subDeviceId } = this.getData();
        this.log("Device data: ", subDeviceId);

        this.registerCapability('onoff', CLUSTER.ON_OFF, {
            endpoint: subDeviceId === 'secondSwitch' ? 11 : 10,
        });

        this.registerCapability('dim', CLUSTER.LEVEL_CONTROL, {
            endpoint: subDeviceId === 'secondSwitch' ? 11 : 10,
        });

    }

    onDeleted(){
		this.log("2 Gang Dimmer removed")
	}

}

module.exports = Wiser_Dimmer_2;

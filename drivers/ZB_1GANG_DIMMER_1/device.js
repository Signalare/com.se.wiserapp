'use strict';

const WiserGenericDevice = require('../../lib/ZB_WiserGenericDevice');

class ZB_1GANG_DIMMER_1 extends WiserGenericDevice {

  mainEndpoint = 3; // TODO: Not tested, get interview.json to get endpoint and clusters.

}

module.exports = ZB_1GANG_DIMMER_1;

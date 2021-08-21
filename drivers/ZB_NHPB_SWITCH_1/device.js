'use strict';

const WiserGenericDevice = require('../../lib/ZB_WiserGenericDevice');

class ZB_NHPB_SWITCH_1 extends WiserGenericDevice {

  mainEndpoint = 1;
  wiserEndpoint = 21;

}

module.exports = ZB_NHPB_SWITCH_1;

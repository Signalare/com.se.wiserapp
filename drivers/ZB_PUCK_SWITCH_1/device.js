'use strict';

const { ZigBeeDevice } = require('homey-meshdriver');

class ZB_PUCK_SWITCH_1 extends ZigBeeDevice {

  onMeshInit() {
    // Developer options
    // this.printNode();
    // this.enableDebug();

    // Register onoff capability
    if (this.hasCapability('onoff')) {
      this.registerCapability('onoff', 'genOnOff', { endpoint: 0 });
      this.registerAttrReportListener('genOnOff', 'onOff', 1, 60, 1, this.onOffReport.bind(this), 0)
        .catch(err => {
          this.error(err);
        });
      this._attrReportListeners['2_genOnOff'] = this._attrReportListeners['2_genOnOff'] || {};
      this._attrReportListeners['2_genOnOff']['onOff'] = this.onOffReport.bind(this);
    }

    this.log('Driver has been initied');
  }

  // onOffReport
  onOffReport(value) {
    const parsedValue = (value === 1);
    this.setCapabilityValue('onoff', parsedValue);
  }

}

module.exports = ZB_PUCK_SWITCH_1;

'use strict';

const { ZigBeeDevice } = require('homey-meshdriver');

class WDE002910 extends ZigBeeDevice {

	onMeshInit() {
		
		// Developer options
		// this.printNode();
		// this.enableDebug();

		// Register onoff capability
		if (this.hasCapability('onoff')) {
			this.registerCapability('onoff', 'genOnOff', { endpoint: 0 });
			this.registerAttrReportListener('genOnOff', 'onOff', 1, 60, 1, this.onOffReport.bind(this), 0)
				.catch(err => {
					this.error();
				});
			this._attrReportListeners['2_genOnOff'] = this._attrReportListeners['2_genOnOff'] || {};
			this._attrReportListeners['2_genOnOff']['onOff'] = this.onOffReport.bind(this);
		}

		this.log('Driver has been initied');
		
	}

	// onOffReport
	onOffReport(value) {
		const parsedValue = (value === 1);
		this.log('OnOff Status, genOnOff', value, parsedValue);
		this.setCapabilityValue('onoff', parsedValue);
	}

}

module.exports = WDE002910;

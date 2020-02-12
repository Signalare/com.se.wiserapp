'use strict';

const { ZigBeeDevice } = require('homey-meshdriver');

class ZB_NHROTARY_DIMMER_1 extends ZigBeeDevice {

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

		// Register dim capability
		if (this.hasCapability('dim')) {
			this.registerCapability('dim', 'genLevelCtrl', { endpoint: 0 });
			this.registerAttrReportListener('genLevelCtrl', 'currentLevel', 3, 60, 3, this.dimLevelReport.bind(this), 0)
				.catch(err => {
					this.error();
				});
			this._attrReportListeners['2_genLevelCtrl'] = this._attrReportListeners['2_genLevelCtrl'] || {};
			this._attrReportListeners['2_genLevelCtrl']['currentLevel'] = this.dimLevelReport.bind(this);
		}

		this.log('Driver has been initied');
		
	}

	// onOffReport
	onOffReport(value) {
		const settings = this.getSettings();
		const parsedValue = (value === 1);
		this.log('OnOff Status, genOnOff', value, parsedValue);
		if ( settings.retain_dim_level == true ) {
			this.node.endpoints[0].clusters['genLevelCtrl'].read("currentLevel")
			.then(level => {
				this.node.endpoints[0].clusters['genLevelCtrl'].write("onLevel", level)
				.catch(err => {
					this.error()
				});
			});
		} else {
			this.node.endpoints[0].clusters['genLevelCtrl'].write("onLevel", 254)
			.catch(err => {
				this.error()
			});
		};
		this.setCapabilityValue('onoff', parsedValue);
	}

	// dimLevelReport
	dimLevelReport(value) {
		const parsedValue = value / 254;
		this.log('Dim level, genLevelCtrl', value, parsedValue);
		this.setCapabilityValue('dim', parsedValue);
	}

}

module.exports = ZB_NHROTARY_DIMMER_1;

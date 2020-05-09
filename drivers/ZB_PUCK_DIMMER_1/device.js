'use strict';

const { ZigBeeDevice } = require('homey-meshdriver');

class ZB_PUCK_DIMMER_1 extends ZigBeeDevice {

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

		// Register dim capability
		if (this.hasCapability('dim')) {
			this.registerCapability('dim', 'genLevelCtrl', { endpoint: 0 });
			this.registerAttrReportListener('genLevelCtrl', 'currentLevel', 3, 60, 3, this.dimLevelReport.bind(this), 0)
				.catch(err => {
					this.error(err);
				});
			this._attrReportListeners['2_genLevelCtrl'] = this._attrReportListeners['2_genLevelCtrl'] || {};
			this._attrReportListeners['2_genLevelCtrl']['currentLevel'] = this.dimLevelReport.bind(this);
		}

		this.log('Driver has been initied');
	}

	// onOffReport
	onOffReport(value) {
		const parsedValue = (value === 1);
		this.setCapabilityValue('onoff', parsedValue);
	}

	// dimLevelReport
	dimLevelReport(value) {
		const parsedValue = value / 254;
		this.setCapabilityValue('dim', parsedValue);
	}

	async onSettings(oldSettingsObj, newSettingsObj, changedKeysArr) {

		// onLevel
		if (changedKeysArr.includes('onlevel_memory') || changedKeysArr.includes('onlevel_level')) {
			var onLevel = 255;
			if (!newSettingsObj['onlevel_memory']) {
				onLevel = Math.round(2.555556 * newSettingsObj["onlevel_level"] - 1.555556); // 1-100=1-254
			}
			this.log('onLevel', onLevel);
			this.node.endpoints[0].clusters['genLevelCtrl'].write("onLevel", onLevel)
				.catch(err => {
					this.error(err)
				});
		}

		// minLevel
		if (changedKeysArr.includes('brightness_min')) {
			const minLevel = Math.round(6.487179 * newSettingsObj['brightness_min'] - 5.487179); // 1-40=1-254
			this.log('minLevel', minLevel);
			this.node.endpoints[0].clusters['lightingBallastCfg'].write('minLevel', minLevel)
				.catch(err => {
					this.error(err)
				});
		}

		// maxLevel
		if (changedKeysArr.includes('brightness_max')) {
			const maxLevel = Math.round(6.325 * newSettingsObj['brightness_max'] - 378.5); // 60-100=1-254
			this.log('maxLevel', maxLevel);
			this.node.endpoints[0].clusters['lightingBallastCfg'].write('maxLevel', maxLevel)
				.catch(err => {
					this.error(err)
				});
		}
	}

}

module.exports = ZB_PUCK_DIMMER_1;

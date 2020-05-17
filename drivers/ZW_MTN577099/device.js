'use strict';

const Homey = require('homey');
const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

class ZW_MTN577099 extends ZwaveDevice {

	/* This dimmer first sends the commands to the associated devices (group 2) and only after 10 seconds sends the report with status change to the controller
	 * To mitigate the slow UI response additional parameter recoverDimValuehas been used that restores the value after receiving the SET command (group 2)
	 */

	async onMeshInit() {
    this.enableDebug();
    this.printNode();

		// supported scenes and their reported scene notification ID's (not used for this device)
		this.sceneMap = {
      'Key Pressed 1 time': {
        scene: 'Key Pressed 1 time',
      },
      'Key Held Down': {
        scene: 'Key Held Down',
      },
      'Key Released': {
        scene: 'Key Released',
      },
    };

    this.registerCapability('onoff', 'SWITCH_MULTILEVEL', {
      setParser(value) {
        if (this.hasCapability('dim')) {
					// set recoverDimValue when turning off
					if (!value) this.recoverDimValue = this.getCapabilityValue('dim');
					// update dim value when changing onoff state
					this.setCapabilityValue('dim', value ? this.recoverDimValue : 0);
				}
        return {
          Value: (value) ? 'on/enable' : 'off/disable',
        };
      },
    });

    this.registerCapability('dim', 'SWITCH_MULTILEVEL', {
			setParserV1(value) {
				if (this.hasCapability('onoff')) this.setCapabilityValue('onoff', value > 0);
				// set recoverDimValue when changing dim level
				this.recoverDimValue = value;
				return {
					Value: Math.round(value * 99),
				};
			},
      reportParserV1(report) {
        if (report && report.hasOwnProperty('Value (Raw)')) {
          if (this.hasCapability('onoff')) this.setCapabilityValue('onoff', report['Value (Raw)'][0] > 0);
          if (report['Value (Raw)'][0] === 255) return 1;
					// set recoverDimValue when dim level changed
          this.recoverDimValue = report['Value (Raw)'][0] / 99;
          return report['Value (Raw)'][0] / 99;
        }
        return null;
      },
    });

    // Default SWITCH_MULTILEVEL_REPORT has delay of 10 seconds, using SWITCH_MULTILEVEL_SET to provide fast UI response
    this.registerReportListener('SWITCH_MULTILEVEL', 'SWITCH_MULTILEVEL_SET', (rawReport, parsedReport) => {
      if (rawReport && rawReport.hasOwnProperty('Value (Raw)')) {
        const parsedValue = rawReport['Value (Raw)'][0];
        if (this.hasCapability('onoff')) this.setCapabilityValue('onoff', parsedValue > 0);
        if (parsedValue === 255) {
					// update dim value when changing onoff state
          this.setCapabilityValue('dim', this.recoverDimValue);
        } else {
          this.setCapabilityValue('dim', parsedValue / 99);
          if (parsedValue > 0) this.recoverDimValue = parsedValue / 99;
        }
				this.log('SWITCH_MULTILEVEL_SET | Triggering scene triggers, Key Pressed 1 time');
				const remoteValue = {
					scene: 'Key Pressed 1 time',
				};
				// Trigger the trigger card with 1 dropdown option
				Homey.app.triggerButton1_scene.trigger(this, null, remoteValue);
				// Trigger the trigger card with tokens
				Homey.app.triggerButton1_button.trigger(this, remoteValue, null);
      }
    });

    this.registerReportListener('SWITCH_MULTILEVEL', 'SWITCH_MULTILEVEL_START_LEVEL_CHANGE', (rawReport, parsedReport) => {
			this.log('SWITCH_MULTILEVEL_START_LEVEL_CHANGE | Triggering scene triggers, Key Held Down');
			const remoteValue = {
				scene: 'Key Held Down',
			};
			// Trigger the trigger card with 1 dropdown option
			Homey.app.triggerButton1_scene.trigger(this, null, remoteValue);
			// Trigger the trigger card with tokens
			Homey.app.triggerButton1_button.trigger(this, remoteValue, null);

    });

    this.registerReportListener('SWITCH_MULTILEVEL', 'SWITCH_MULTILEVEL_STOP_LEVEL_CHANGE', (rawReport, parsedReport) => {
			this.log('SWITCH_MULTILEVEL_STOP_LEVEL_CHANGE | Triggering scene triggers, Key Released');
			const remoteValue = {
				scene: 'Key Released',
			};
			// Trigger the trigger card with 1 dropdown option
			Homey.app.triggerButton1_scene.trigger(this, null, remoteValue);
			// Trigger the trigger card with tokens
			Homey.app.triggerButton1_button.trigger(this, remoteValue, null);
    });

		// define and register FlowCardTriggers
		this.onSceneAutocomplete = this.onSceneAutocomplete.bind(this);

    this.setAvailable();
		this.log('Schneider Universal super dimmer insert has been inited');
  }

	onSceneAutocomplete(query, args, callback) {
		let resultArray = [];
		for (let sceneID in this.sceneMap) {
			resultArray.push({
				id: this.sceneMap[sceneID].scene,
				name: Homey.__(this.sceneMap[sceneID].scene),
			})
		}
		// filter for query
		resultArray = resultArray.filter(result => {
			return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
		});
		this._debug(resultArray);
		return Promise.resolve(resultArray);
	}

}

module.exports = ZW_MTN577099;

/*
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] ------------------------------------------
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] Node: 75
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] - Manufacturer id: 122
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] - ProductType id: 16387
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] - Product id: 1
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] - Firmware Version: 2.2
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] - Hardware Version:
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] - Firmware id: undefined
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] - Secure: ⨯
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] - Battery: false
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] - DeviceClassBasic: BASIC_TYPE_ROUTING_SLAVE
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] - DeviceClassGeneric: GENERIC_TYPE_SWITCH_MULTILEVEL
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] - DeviceClassSpecific: SPECIFIC_TYPE_POWER_SWITCH_MULTILEVEL
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] - Token: f9c0d4c2-80cb-4558-83a3-508bb69fff50
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] - CommandClass: COMMAND_CLASS_MANUFACTURER_SPECIFIC
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Version: 1
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Commands:
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- MANUFACTURER_SPECIFIC_GET
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- MANUFACTURER_SPECIFIC_REPORT
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] - CommandClass: COMMAND_CLASS_VERSION
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Version: 1
2020-05-17 14:08:40 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Commands:
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- VERSION_COMMAND_CLASS_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- VERSION_COMMAND_CLASS_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- VERSION_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- VERSION_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] - CommandClass: COMMAND_CLASS_CONFIGURATION
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Version: 2
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Commands:
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- CONFIGURATION_BULK_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- CONFIGURATION_BULK_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- CONFIGURATION_BULK_SET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- CONFIGURATION_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- CONFIGURATION_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- CONFIGURATION_SET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] - CommandClass: COMMAND_CLASS_ASSOCIATION
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Version: 1
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Commands:
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- ASSOCIATION_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- ASSOCIATION_GROUPINGS_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- ASSOCIATION_GROUPINGS_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- ASSOCIATION_REMOVE
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- ASSOCIATION_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- ASSOCIATION_SET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] - CommandClass: COMMAND_CLASS_MULTI_INSTANCE_ASSOCIATION
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Version: 1
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Commands:
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- MULTI_INSTANCE_ASSOCIATION_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- MULTI_INSTANCE_ASSOCIATION_GROUPINGS_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- MULTI_INSTANCE_ASSOCIATION_GROUPINGS_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- MULTI_INSTANCE_ASSOCIATION_REMOVE
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- MULTI_INSTANCE_ASSOCIATION_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- MULTI_INSTANCE_ASSOCIATION_SET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] - CommandClass: COMMAND_CLASS_SWITCH_MULTILEVEL
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Version: 1
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Commands:
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- SWITCH_MULTILEVEL_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- SWITCH_MULTILEVEL_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- SWITCH_MULTILEVEL_SET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- SWITCH_MULTILEVEL_START_LEVEL_CHANGE
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- SWITCH_MULTILEVEL_STOP_LEVEL_CHANGE
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] - CommandClass: COMMAND_CLASS_SWITCH_TOGGLE_MULTILEVEL
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Version: 1
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Commands:
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- SWITCH_TOGGLE_MULTILEVEL_SET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- SWITCH_TOGGLE_MULTILEVEL_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- SWITCH_TOGGLE_MULTILEVEL_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- SWITCH_TOGGLE_MULTILEVEL_START_LEVEL_CHANGE
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- SWITCH_TOGGLE_MULTILEVEL_STOP_LEVEL_CHANGE
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] - CommandClass: COMMAND_CLASS_SWITCH_ALL
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Version: 1
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Commands:
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- SWITCH_ALL_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- SWITCH_ALL_OFF
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- SWITCH_ALL_ON
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- SWITCH_ALL_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- SWITCH_ALL_SET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] - CommandClass: COMMAND_CLASS_PROTECTION
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Version: 2
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Commands:
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- PROTECTION_EC_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- PROTECTION_EC_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- PROTECTION_EC_SET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- PROTECTION_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- PROTECTION_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- PROTECTION_SET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- PROTECTION_SUPPORTED_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- PROTECTION_SUPPORTED_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- PROTECTION_TIMEOUT_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- PROTECTION_TIMEOUT_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- PROTECTION_TIMEOUT_SET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] - CommandClass: COMMAND_CLASS_BASIC
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Version: 1
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] -- Commands:
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- BASIC_GET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- BASIC_REPORT
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] --- BASIC_SET
2020-05-17 14:08:41 [log] [ManagerDrivers] [ZW_MTN577099] [0] ------------------------------------------
*/

'use strict';

const { ZwaveDevice } = require('homey-zwavedriver');

class ZW_MTN50X6XX extends ZwaveDevice {

  /* This dimmer first sends the commands to the associated devices (group 2) and only after
   * 10 seconds sends the report with status change to the controller.
   * To mitigate the slow UI response additional parameter recoverDimValuehas been used that
   * restores the value after receiving the SET command (group 2)
   */

  async onNodeInit() {
    this.enableDebug();
    this.printNode();

    // supported scenes and their reported scene notification ID's (not used for this device)
    this.sceneMap = {
      'Key Pressed 1 time': 'Key Pressed 1 time',
      'Key Held Down': 'Key Held Down',
      'Key Released': 'Key Released',
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

    // Default SWITCH_MULTILEVEL_REPORT has delay of 10 seconds,
    // using SWITCH_MULTILEVEL_SET to provide fast UI response
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
        this.homey.app.triggerButton1_scene.trigger(this, null, remoteValue);
        // Trigger the trigger card with tokens
        this.homey.app.triggerButton1_button.trigger(this, remoteValue, null);
      }
    });

    this.registerReportListener('SWITCH_MULTILEVEL', 'SWITCH_MULTILEVEL_START_LEVEL_CHANGE', (rawReport, parsedReport) => {
      this.log('SWITCH_MULTILEVEL_START_LEVEL_CHANGE | Triggering scene triggers, Key Held Down');
      const remoteValue = {
        scene: 'Key Held Down',
      };
      // Trigger the trigger card with 1 dropdown option
      this.homey.app.triggerButton1_scene.trigger(this, null, remoteValue);
      // Trigger the trigger card with tokens
      this.homey.app.triggerButton1_button.trigger(this, remoteValue, null);
    });

    this.registerReportListener('SWITCH_MULTILEVEL', 'SWITCH_MULTILEVEL_STOP_LEVEL_CHANGE', (rawReport, parsedReport) => {
      this.log('SWITCH_MULTILEVEL_STOP_LEVEL_CHANGE | Triggering scene triggers, Key Released');
      const remoteValue = {
        scene: 'Key Released',
      };
      // Trigger the trigger card with 1 dropdown option
      this.homey.app.triggerButton1_scene.trigger(this, null, remoteValue);
      // Trigger the trigger card with tokens
      this.homey.app.triggerButton1_button.trigger(this, remoteValue, null);
    });

    // define and register FlowCardTriggers
    this.onSceneAutocomplete = this.onSceneAutocomplete.bind(this);

    this.setAvailable();
    this.log('Schneider Universal super dimmer insert has been inited');
  }

  onSceneAutocomplete(query, args, callback) {
    let resultArray = [];
    for (const sceneID in this.sceneMap) {
      resultArray.push({
        id: this.sceneMap[sceneID],
        name: this.homey.__(this.sceneMap[sceneID]),
      });
    }
    // filter for query
    resultArray = resultArray.filter(result => {
      return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    });
    this._debug(resultArray);
    return Promise.resolve(resultArray);
  }

}

module.exports = ZW_MTN50X6XX;

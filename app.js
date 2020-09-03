'use strict';

const Homey = require('homey');

class WiserApp extends Homey.App {

  onInit() {
    this.triggerButton1_button = this.homey.flow
      .getDeviceTriggerCard('trigger_button1_button');

    this.triggerButton1_scene = this.homey.flow
      .getDeviceTriggerCard('trigger_button1_scene');
    this.triggerButton1_scene
      .registerRunListener((args, state) => Promise.resolve(args.scene.id === state.scene));

    this.triggerButton1_scene
      .getArgument('scene')
      .registerAutocompleteListener((query, args, callback) => args.device.onSceneAutocomplete(query, args, callback));

    this.actionZWStartDimLevelChange = this.homey.flow
      .getActionCard('action_ZW_DIM_startLevelChange');

    this.actionZWStartDimLevelChange
      .registerRunListener(this._actionStartDimLevelChangeRunListener.bind(this));

    this.actionZWStopDimLevelChange = this.homey.flow
      .getActionCard('action_ZW_DIM_stopLevelChange');

    this.actionZWStopDimLevelChange
      .registerRunListener(this._actionStopDimLevelChangeRunListener.bind(this));

    this.log('Schneider Electric App is running...');
  }

  async _actionStartDimLevelChangeRunListener(args, state) {
    if (args.device.hasCommandClass('SWITCH_MULTILEVEL')) {
      try {
        let startLevelChangeObj = {};
        args.device.log('FlowCardAction triggered to start dim level change in direction', args.direction);

        const nodeCommandClassVersion = parseInt(args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL.version);
        if (nodeCommandClassVersion === 1) {
          startLevelChangeObj = {
            Level: {
              'Ignore Start Level': true,
              'Up/ Down': args.direction === '1',
              Reserved2: false,
            },
            'Start Level': 5,
          };
        } else if (nodeCommandClassVersion > 1) {
          startLevelChangeObj = {
            Properties1: Buffer.from([args.direction === '1' ? (nodeCommandClassVersion > 2 ? 0x68 : 0x60) : 0x20]), // direction based, always ignoring start level
            'Start Level': 0,
            'Dimming Duration': args.duration / 1000 || 255, // if no duration has been set, use factory default (255),
            'Step Size': 1,
          };
        }
        return await args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL.SWITCH_MULTILEVEL_START_LEVEL_CHANGE(startLevelChangeObj);
      } catch (error) {
        args.device.log(error.message);
        return Promise.reject(new Error(error.message));
      }
    }
    return Promise.reject(new Error('Not supporting correct commandClass'));
  }

  async _actionStopDimLevelChangeRunListener(args, state) {
    if (args.device.hasCommandClass('SWITCH_MULTILEVEL')) {
      try {
        args.device.log('FlowCardAction triggered to stop dim level change');
        return await args.device.node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL.SWITCH_MULTILEVEL_STOP_LEVEL_CHANGE({});
      } catch (error) {
        args.device.log(error.message);
        return Promise.reject(new Error(error.message));
      }
    }
    return Promise.reject(new Error('Not supporting correct commandClass'));
  }

}

module.exports = WiserApp;

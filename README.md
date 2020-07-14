# Schnieder Electric Wiser

Adds support for Schnieder Electric Wiser devices

### Changelog
0.2.1
- Fix: Force device to update capability values when starting app.

0.2.0
- Rewrite of all zigbee drivers to support SDK 3
- Added zigbee driver ZB_NHPB_SWITCH_1: Push button switch (WDE002476, WDE003476, WDE004476)

0.1.0
- Added zigbee driver ZB_PUCK_SWITCH_1: Micro Module Switch (CCT5011-0001)
- Added support for min and max dimming
- Fixed the remember dim level, now the level is stored in the modules.

0.0.1
- Initial version
- Added zigbee driver ZB_NHROTARY_DIMMER_1: Rotary Dimmer (WDE002334, WDE003334, WDE004334)
- Added zigbee driver ZB_1GANG_DIMMER_1: Push Dimmer (WDE002910)
- Added zigbee driver ZB_PUCK_DIMMER_1: Micro Module Dimmer (CCT5010-0001)

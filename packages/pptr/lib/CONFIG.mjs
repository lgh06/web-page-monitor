import { globalConfig } from "@webest/web-page-monitor-helper";

let CONFIG = {
  mqConnString: '' || globalConfig.mqConnString,
  dynJSPath: `http://localhost:3002/api/dynjs/`,
  socketio: `http://localhost:3003/`,
  debug: true, // false in production
};

export { CONFIG, CONFIG as default };
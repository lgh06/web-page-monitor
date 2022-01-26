import { globalConfig } from "@webest/web-page-monitor-helper";

let CONFIG = {
  dynJSPath: `http://localhost:3002/api/dynjs/`,
  socketio: `http://localhost:3003/`,
  debug: true, // false in production
  pptrThreadNum: globalConfig.pptrThreadNum,
  mqConnString: '' || globalConfig.mqConnString,
  exchange: '' || globalConfig.exchange,
  queue: '' || globalConfig.queue,
  queueBinding: '' || globalConfig.queueBinding,
};

export { CONFIG, CONFIG as default };
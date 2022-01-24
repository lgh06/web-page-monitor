import { globalConfig } from "@webest/web-page-monitor-helper/globalConfig.mjs";

let CONFIG = {
  mongodbURI: '' || globalConfig.mongodbURI,
  mqConnString: '' || globalConfig.mqConnString,
  exchange: '' || globalConfig.exchange,
  queue: '' || globalConfig.queue,
  queueBinding: '' || globalConfig.queueBinding,
};



export { CONFIG, CONFIG as default };
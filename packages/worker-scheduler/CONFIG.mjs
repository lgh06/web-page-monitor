import { globalConfig } from "@webest/web-page-monitor-helper";

let CONFIG = {
  mqConnString: '' || globalConfig.mqConnString,
  exchange: '' || globalConfig.exchange,
  queue: '' || globalConfig.queue,
  queueBinding: '' || globalConfig.queueBinding,
};



export { CONFIG, CONFIG as default };
import { globalConfig } from "@webest/web-page-monitor-helper";

let CONFIG = {
  mongodbURI: '' || globalConfig.mongodbURI,
  mqConnString: '' || globalConfig.mqConnString,
  exchange: '' || globalConfig.exchange,
  queue: '' || globalConfig.queue,
  queueBinding: '' || globalConfig.queueBinding,
  pptrToWorkerQueue: '' || globalConfig.pptrToWorkerQueue,
};



export { CONFIG, CONFIG as default };
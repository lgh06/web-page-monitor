import { globalConfig } from "@webest/web-page-monitor-helper";

let CONFIG = {
  dbName: '' || globalConfig.dbName,
  mongodbURI: '' || globalConfig.mongodbURI,
  mqConnString: '' || globalConfig.mqConnString,
  exchange: '' || globalConfig.exchange,
  queue: '' || globalConfig.queue,
  queueBinding: '' || globalConfig.queueBinding,
  pptrToWorkerQueue: '' || globalConfig.pptrToWorkerQueue,
  nodemailer: globalConfig.nodemailer,
};



export { CONFIG, CONFIG as default };
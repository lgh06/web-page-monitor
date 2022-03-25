/**
 * !!!!!!!!!
 * DO NOT import this file in web, neither frontend nor backend.
 * 在web項目的前端或後端中，都不要引入這個文件。
 * use .env.production instead.
 * 使用 .env.production 文件。
 * !!!!!!
 */
import { globalConfigProd } from "./globalConfig.prod.mjs";
// config value across all projects.  
// if not defined here, use sub-package defined values
// TODO
let globalConfigLocal = {
  dbName: 'webmonitordb',
  mongodbURI: 'mongodb://localhost:27017/',
  mqConnString: 'amqp://localhost',
  // below values both used in worker / scheduler
  // as rabbitmq's producer;
  // and used in pptr
  // as rabbitmq's consumer.
  exchange: 'testPptrTaskDelayExchange001',
  queue: 'testPptrTaskQueue001',
  queueBinding: 'testPptrBindingName',
  // pptr
  pptrThreadNum: 2,
  pptrToWorkerQueue: 'testPptrHistoryQueue001',
  dynJSPath: `http://localhost:3002/api/script/`,
  pptrId: -1, // -1 means dev, 0 means not set, real prod server set to 1,2,3,4,5... (number)
  // Nodemailer App config for local debug use
  nodemailer: {
    host: 'localhost',
    port: 10260,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'project.1',
      pass: 'secret.1',
    },
    from: '"Changes Alert 变动通知" <alert@webmonitoralertali.passby.me>',
  }
}

let globalConfig;
if(globalConfigProd.useProdConfig){
  // use aliyun mail send service
  globalConfig = Object.assign({}, globalConfigLocal, globalConfigProd);
}else{
  // use local mail debug config
  globalConfig = Object.assign({}, globalConfigLocal);
}



export { globalConfig }
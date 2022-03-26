import { simpleMode } from "./simpleMode.mjs";
import { sendResultToWorker } from "./sendResultToWorker.mjs";
import * as amqp from 'amqplib';
import { CONFIG } from "./CONFIG.mjs";
import { ESMImport } from "@webest/web-page-monitor-esm-loader"



const exchange = CONFIG.exchange;
const queue = CONFIG.queue;
const queueBinding = CONFIG.queueBinding;
let connString = CONFIG.mqConnString

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  // TODO subscribe MQ
  // distinct different mode, then use different mjs to execute pptr

  let conn;
  try {
    conn = await amqp.connect(connString);
  } catch (error) {
    await delay(30000);
    console.error('inside pptr main() error')
    conn = null;
    return main();
  }
  let channel = await conn.createChannel();
  let sendResultToWorkerChannel = await conn.createChannel();
  // assertExchange in consumer can be deleted in fact
  await channel.assertExchange(exchange, 'x-delayed-message', { durable: true, arguments: { 'x-delayed-type': 'direct' } });
  await channel.assertQueue(queue, { durable: true, messageTtl : 2160000 });
  await channel.bindQueue(queue, exchange, queueBinding);

  // TODO increase to 4 for production
  await channel.prefetch(CONFIG.debug ? 1 : CONFIG.pptrThreadNum, true);
  await channel.consume(queue, async function (message) {
    let taskDetail;
    let consumeTime = Date.now();
    // console.log(message)
    if (message !== null) {
      let stringTaskDetail = message.content.toString();
      console.log('consume time', new Date(consumeTime))
      try {
        taskDetail = JSON.parse(stringTaskDetail);
      } catch (error) {
        console.error(error);
        return channel.ack(message)
      }
      if (taskDetail.mode === 'simp') {
        try {
          let [result, err] = await simpleMode(taskDetail);
          let extra = taskDetail.extra;
          let eraserModuleArr = [];
          if(extra && extra.eraserArr && extra.eraserArr.length){
            for(let id of extra.eraserArr){
              try {
                let mod = await ESMImport(`${CONFIG.dynJSPath}${id}.js`);
                eraserModuleArr.push(mod);
              } catch (error) {
                console.error(`fetch script ${id} error`, error)
              }
            }
          }
          for(let mod of eraserModuleArr){
            let oneResultEraser = mod;
            if(
                (!err) 
                && oneResultEraser 
                && oneResultEraser.urlRegExpArr 
                && oneResultEraser.urlRegExpArr.length
                && oneResultEraser.replace
                && ( oneResultEraser.urlRegExpArr.find(reg => taskDetail.pageURL.match( new RegExp(reg) ) ) )
              ){
              // TODO dynamic resultEraser
              try {
                result = oneResultEraser.replace(result);
              } catch (error) {
                console.error('resultEraser error inside pptr.mjs', error)
                err = err + 'resultEraser error';
              }
            }
          }

          // if pptr result's length is less than `extra.minLength`, 
          // then treat it as an error.
          if((!err) && taskDetail && taskDetail.extra && taskDetail.extra.minLength && Number(taskDetail.extra.minLength) !== 0){
            if(result.length < taskDetail.extra.minLength){
              result = null;
              err = 'result length less than minLength';
            }
          }
          let res = {
            result,
            err,
            consumeTime,
            finishTime: new Date(),
            taskDetail,
            pptrId: CONFIG.pptrId || 1,
          }
          await sendResultToWorker(res, conn, sendResultToWorkerChannel)
        } catch (error) {
          console.error(error);
        } finally {
          channel.ack(message)
        }
      }
    }
  }, {
    noAck: false
  })

}

// async function retryMain(){
//   console.log('inside retryMain()')
//   try {
//     main();
//   } catch (error) {
//     console.error(error)
//     await delay(30000);
//     retryMain();
//   }
// }

try {
  main();
} catch (error) {
  console.error(error)
  // await delay(30000).then(()=>{
  //   retryMain();
  // });
}
// https://github.com/puppeteer/puppeteer/issues/7902#issuecomment-1046020683
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

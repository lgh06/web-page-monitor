import { simpleMode } from "./simpleMode.mjs";
import { sendResultToWorker } from "./sendResultToWorker.mjs";
import * as amqp from 'amqplib';
import { CONFIG } from "./CONFIG.mjs";
import * as eraser from "./eraser/index.mjs";


const exchange = CONFIG.exchange;
const queue = CONFIG.queue;
const queueBinding = CONFIG.queueBinding;
let connString = CONFIG.mqConnString

async function main() {
  // TODO subscribe MQ
  // distinct different mode, then use different mjs to execute pptr

  let conn = await amqp.connect(connString);
  let channel = await conn.createChannel();
  let sendResultToWorkerChannel = await conn.createChannel();
  // assertExchange in consumer can be deleted in fact
  await channel.assertExchange(exchange, 'x-delayed-message', { durable: true, arguments: { 'x-delayed-type': 'direct' } });
  await channel.assertQueue(queue, { durable: true, messageTtl : 86400000 });
  await channel.bindQueue(queue, exchange, queueBinding);

  // TODO increase to 4 for production
  await channel.prefetch(CONFIG.debug ? 1 : CONFIG.pptrThreadNum);
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
          if(!err){
            // TODO dynamic eraser
            try {
              result = await eraser.weiboEraser({result, taskDetail});
            } catch (error) {
              console.error('eraser error inside pptr.mjs', error)
            }
          }
          let res = {
            result,
            err,
            consumeTime,
            finishTime: new Date(),
            taskDetail,
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

try {
  main();
} catch (error) {
  console.error(error)
}


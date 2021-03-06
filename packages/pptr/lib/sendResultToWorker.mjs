import * as amqp from 'amqplib';
import { CONFIG } from "./CONFIG.mjs";
/**
 * send pptr execute result and html textContent to MQ,
 * for worker 's later processing and save to MongoDB.
 */

async function sendResultToWorker(res, mqChannel) {
  // let {result, err} = res;
  try {
    let queue = CONFIG.pptrToWorkerQueue;
    let channel = mqChannel;
  
    await channel.assertQueue(queue, {durable: true,messageTtl: 2160000});
    let stringRes = JSON.stringify(res);
    channel.sendToQueue(queue, Buffer.from(stringRes), { persistent: true });
  } catch (error) {
    console.error(error)
  }
}

export { sendResultToWorker }
import * as amqp from 'amqplib';
import { CONFIG } from "./CONFIG.mjs";
/**
 * send pptr execute result and html textContent to MQ,
 * for worker 's later processing and save to MongoDB.
 */

async function sendResultToWorker(res, mqConn) {
  // let {result, err} = res;
  let conn = mqConn;
  let queue = CONFIG.pptrToWorkerQueue;
  try {
    let channel = await conn.createChannel();
  
    await channel.assertQueue(queue, {
      durable: true,
    });
    let stringRes = JSON.stringify(res);
    channel.sendToQueue(queue, Buffer.from(stringRes), { persistent: true });
  } catch (error) {
    console.error(error)
  }
}

export { sendResultToWorker }
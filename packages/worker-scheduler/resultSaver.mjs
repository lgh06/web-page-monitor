import * as amqp from 'amqplib';

import { CONFIG } from "./CONFIG.mjs";

let connString = CONFIG.mqConnString

async function resultSaver(mqConn,mqChannel){
  let conn, channel;
  conn = mqConn || await amqp.connect(connString);
  channel = mqChannel || await conn.createChannel();
  let queue = CONFIG.pptrToWorkerQueue;

  await channel.assertQueue(queue, {
    durable: true,
  });

  await channel.prefetch(1);
  await channel.consume(queue, function (message) {
    // console.log(message)
    if (message !== null) {
      let stringResult = message.content.toString();
      console.log('inside worker resultSaver');
      console.log(stringResult);

      return channel.ack(message)
    }
  }, {
    noAck: false
  })

}

export { resultSaver }
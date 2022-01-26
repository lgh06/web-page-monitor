import * as amqp from 'amqplib';
import { getDB, ObjectId } from './lib/index.mjs';
import { mongo } from "@webest/web-page-monitor-helper/node/index.mjs";

import { CONFIG } from "./CONFIG.mjs";

let connString = CONFIG.mqConnString

// pptr result save to DB
// and detect changes and send emails / phone calls
async function resultSaver(mqConn,mqChannel){
  let db = await getDB();
  if (!db) return;
  let conn, channel;
  conn = mqConn || await amqp.connect(connString);
  channel = mqChannel || await conn.createChannel();
  let queue = CONFIG.pptrToWorkerQueue;

  await channel.assertQueue(queue, {
    durable: true,
  });

  await channel.prefetch(5);
  await channel.consume(queue, async function (message) {
    // console.log(message)
    if (message !== null) {
      let stringResponse = message.content.toString();
      // console.log('inside worker resultSaver');
      // console.log(stringResponse);
      let response = JSON.parse(stringResponse);

      let { result, err, time, taskDetail } = response;
      console.log(err, time, taskDetail)
      console.log('task first created on', new Date( new ObjectId( taskDetail._id).getTimestamp() ) )
      console.log('task this time started on', new Date( taskDetail.nextExecuteTime ) )
      console.log('task this time finished on', new Date( time ) )
      console.log('task end on', new Date( taskDetail.endTime ) )

      let oneTaskHistory = {
        beginTime: taskDetail.nextExecuteTime,
        finishTime: time,
        err: err,
        textHash: result,
        textContent: result,
        taskId: new ObjectId(taskDetail._id),
      }
      try {
        await mongo.upsertDoc(db, 'taskHistory', null, oneTaskHistory);
      } catch (error) {
        console.error(error);
      }
      return channel.ack(message)
    }
  }, {
    noAck: false
  })

}

export { resultSaver }
import * as amqp from 'amqplib';
import hashFunc from 'crypto-js/md5.js';
import { getDB, ObjectId } from './lib/index.mjs';
import { mongo } from "@webest/web-page-monitor-helper/node/index.mjs";

import { CONFIG } from "./CONFIG.mjs";

let connString = CONFIG.mqConnString

// pptr result save to DB
// and detect changes and send emails / phone calls
async function resultSaver(mqConn, mqChannel) {
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

      let { result, err, consumeTime, finishTime, taskDetail } = response;
      console.log(err, taskDetail)
      // console.log('task first created on', new Date( new ObjectId( taskDetail._id).getTimestamp() ) )
      console.log('task scheduled on', new Date(taskDetail.nextExecuteTime))
      console.log('task pptr consume start on', new Date(consumeTime))
      console.log('task this time finished on', new Date(finishTime))
      // console.log('task end life on', new Date( taskDetail.endTime ) )

      let cuttedResult;
      if (String(result).length > 500) {
        cuttedResult = String(result).substring(0, 500)
      }

      let hash;
      if (result === null) {
        hash = null;
      } else {
        hash = hashFunc(result).toString();
      }
      console.log(hash)
      let oneTaskHistory = {
        // scheduledTime changes on task table, so we need store it on taskHistory
        scheduledTime: taskDetail.nextExecuteTime,
        consumeTime,
        finishTime: new Date(finishTime),
        err: err,
        textHash: hash,
        textContent: cuttedResult || result,
        taskId: new ObjectId(taskDetail._id),
      }
      try {
        // TODO MongDB authentication and authorization
        // create different users and passwords and roles
        // https://docs.mongodb.com/manual/core/timeseries-collections/
        await db.createCollection("taskHistory", {
          timeseries: {
            timeField: "finishTime",
          },
          expireAfterSeconds: 3600 * 24 * 120, // 120 days
        });
        await mongo.upsertDoc(db, 'taskHistory', null, oneTaskHistory);
      } catch (error) {
        // https://mongodb.github.io/node-mongodb-native/4.3/classes/MongoError.html
        if(error.code === 48 && error.codeName === 'NamespaceExists' && error.name === 'MongoServerError'){
          // do nothing because this is a known MongoDB error
          // when the taskHistory time-series collection already exists
        }else{
          console.error(error);
        }
      }
      return channel.ack(message)
    }
  }, {
    noAck: false
  })

}

export { resultSaver }
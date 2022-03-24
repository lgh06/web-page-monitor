import * as amqp from 'amqplib';
import hashFunc from 'crypto-js/md5.js';
import { getDB, ObjectId } from '../lib/index.mjs';
import { mongo } from "@webest/web-page-monitor-helper/node/index.mjs";
import { singleTaskHistoryChecker, singleTaskWordChecker } from './taskHistoryChecker.mjs';

import { CONFIG } from "../CONFIG.mjs";

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
    messageTtl: 86400000,
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
      if(typeof finishTime !== 'object') { // may be jsonfied string
        finishTime = new Date(finishTime)
      }
      // console.log(err, taskDetail)
      // console.log('task first created on', new Date( new ObjectId( taskDetail._id).getTimestamp() ) )
      // console.log('task scheduled on', new Date(taskDetail.nextExecuteTime))
      // console.log('task pptr consume start on', new Date(consumeTime))
      // console.log('task this time finished on', finishTime)
      // console.log('task end life on', new Date( taskDetail.endTime ) )

      let cuttedResult;
      if (String(result).length > 2000) {
        cuttedResult = String(result).substring(0, 2000) + `......${String(result).length - 2000} more`;
      }

      let hash;
      if (result === null) {
        hash = null;
      } else {
        hash = hashFunc(result).toString();
      }
      // console.log(hash)
      let oneTaskHistory = {
        // scheduledTime changes on task table, so we need store it on taskHistory
        scheduledTime: taskDetail.nextExecuteTime,
        consumeTime,
        finishTime,
        err: err,
        textHash: hash,
        textContent: cuttedResult || result,
        taskId: new ObjectId(taskDetail._id),
      }
      try {
        // await 
        // minus points of one user
        if(taskDetail && taskDetail.userInfo && taskDetail.userInfo._id && taskDetail.userInfo.points) {
          await db.collection('user').updateOne({ _id: new ObjectId(taskDetail.userInfo._id) }, {
            '$inc': {
              points: -1,
            }
          }).catch(e => console.error(e))
        }
        let {insertedId} = await mongo.insertDoc(db, 'taskHistory', oneTaskHistory);
        if(taskDetail && taskDetail.extra && String(taskDetail.extra.detectMode) === '2' && taskDetail.extra.detectWord){
          // alert only when word shows up
          await singleTaskWordChecker(taskDetail,result,oneTaskHistory, db, insertedId)
        }else{
          await singleTaskHistoryChecker(taskDetail, db);
        }
      } catch (error) {
        console.log(error);
      }finally{
        channel.ack(message)
      }
    }
  }, {
    noAck: false
  })

}

export { resultSaver }
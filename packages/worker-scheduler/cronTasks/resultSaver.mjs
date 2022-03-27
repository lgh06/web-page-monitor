import * as amqp from 'amqplib';

import hashFunc from 'crypto-js/md5.js';
import { getDB, ObjectId } from '../lib/index.mjs';
import { mongo, amqpHelper } from "@webest/web-page-monitor-helper/node/index.mjs";
import { singleTaskHistoryChecker, singleTaskWordChecker } from './taskHistoryChecker.mjs';

import { CONFIG } from "../CONFIG.mjs";

let connString = CONFIG.mqConnString
let amqpHelperInstance = new amqpHelper(connString);

// save pptr results which are got from MQ, 
// to DB `taskHistory` table,
// and detect diffs and send emails / phone calls
async function resultSaver() {
  let conn, channel, connClosed = false;
  conn = await amqpHelperInstance.getConn();
  channel = await conn.createChannel();
  if(conn){
    conn.on('close', ()=>{
      connClosed = true;
      console.log('conn closed');
      resultSaver();
      conn.off('close');
      db = null;
      channel = null;
      conn = null;
    })
  }
  let queue = CONFIG.pptrToWorkerQueue;

  await channel.assertQueue(queue, {
    durable: true,
    messageTtl: 2160000,
  });

  await channel.prefetch(5, true);
  await channel.consume(queue, async function (message) {
    // console.log(message)
    if(connClosed){
      console.log('conn closed, skip this message');
      return;
    }
    if (message !== null) {
      let stringResponse = message.content.toString();
      // console.log('inside worker resultSaver');
      // console.log(stringResponse);
      let response = JSON.parse(stringResponse);

      let { result, err, consumeTime, finishTime, taskDetail, pptrId = 1 } = response;
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
        scheduledTime: taskDetail.nextExecuteTime, // timestamp
        consumeTime, // timestamp
        finishTime, // Date, mongodb TTL index field
        err: err,
        textHash: hash,
        textContent: cuttedResult || result,
        taskId: new ObjectId(taskDetail._id),
        pptrId,
      }
      try {
        let db = await getDB();
        if (!db) { 
          return;
        }
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
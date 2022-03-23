import { getDB, ObjectId } from "../lib/index.mjs"
import { diffNotifier, wordAppearNotifier } from "./diffNotifier.mjs";
import { Db } from "mongodb";

let collectionName = 'taskHistory';

/**
 * 
 * @param {Db} db 
 */
async function taskHistoryChecker (db){
  db = db || await getDB();
  // db.collection('taskHistory').watch().on('change', async function (change) {})
  // await errorChecker(db)
  // await changesChecker(db)
}
/**
 * @param {object} taskDetail 
 * @param {Db} db 
 */
async function singleTaskHistoryChecker (taskDetail, db){
  db = db || await getDB();
  let nowDate = new Date();
  db.collection(collectionName).find({
    taskId: new ObjectId(taskDetail._id),
    finishTime: {
      $gte: new Date(nowDate.setHours(-24)), /** 24 hours taskHistory */
    }
  }).sort({finishTime: -1}).limit( 6 * 6 ).toArray().then(async docs => {
    if(docs && docs.length){
      docs.filter(doc => (doc.err === null && doc.textHash !== null))
          .reverse().forEach(async (doc, index, arr) => {
        if(index === 0 || doc.checked) return;
        let filter = {_id: doc._id};
        // do something
        let nowCacheOnTask = {};
        if(doc.textHash !== arr[index-1].textHash){
          // TODO send alert
          nowCacheOnTask = await diffNotifier(arr[index-1], doc, taskDetail, db);
          console.log('taskHistoryChecker cacheOnTask', nowCacheOnTask);
          if(nowCacheOnTask && Object.keys(nowCacheOnTask).length){
            await db.collection('task').updateOne({_id: new ObjectId(taskDetail._id)}, {
              $set: {
                cache: nowCacheOnTask,
              }
            });
          }
        }
        await db.collection(collectionName).findOneAndUpdate(filter, {
          $set: {
            checked: 1,
          }
        })
      })
    }
  })
  // db.collection('taskHistory').watch().on('change', async function (change) {})
}
/**
 * @param {object} taskDetail 
 * @param {object} result 
 * @param {Db} db 
 */
async function singleTaskWordChecker (taskDetail, result, db){
  db = db || await getDB();
  let nowDate = new Date();
  if(
    taskDetail && taskDetail.extra && String(taskDetail.extra.detectMode) === '2'
    && taskDetail.extra.detectWord
    && String(result).includes(taskDetail.extra.detectWord)
  ){
    let nowCacheOnTask = {};
    nowCacheOnTask = await wordAppearNotifier(taskDetail, result, db);
    if(nowCacheOnTask && Object.keys(nowCacheOnTask).length && taskDetail._id){
      await db.collection('task').updateOne({_id: new ObjectId(taskDetail._id)}, {
        $set: {
          cache: nowCacheOnTask,
        }
      });
    }
  }
}
/**
 * 
 * @param {Db} db 
 */
async function otherTaskHistoryChecker(db){
  return;
  db = db || await getDB();
  const collection = db.collection('taskHistory')
  const changeStream = collection.watch();
  // https://docs.mongodb.com/v5.0/changeStreams
  // https://docs.mongodb.com/v5.0/reference/change-events
  changeStream.on('change', next => {
    // console.log(next)
  })
}

// taskHistoryChecker();

export { taskHistoryChecker, singleTaskHistoryChecker, singleTaskWordChecker }
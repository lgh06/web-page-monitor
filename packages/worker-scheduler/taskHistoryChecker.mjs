import { getDB, ObjectId } from "./lib/index.mjs"
import { diffNotifier } from "./diffNotifier.mjs";
import { Db } from "mongodb";

let collectionName = 'taskHistory';

/**
 * subscribe mongodb record changes
 * and send alerts to alertProviders
 */

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
    taskId: ObjectId(taskDetail._id),
    finishTime: {
      $gte: new Date(nowDate.setHours(-24)), /** 24 hours taskHistory */
    }
  }).sort({finishTime: -1}).limit( 6 * 24 ).toArray().then(async docs => {
    if(docs && docs.length){
      docs.filter(doc => (doc.err === null && doc.textHash !== null))
          .reverse().forEach(async (doc, index, arr) => {
        if(index === 0 || doc.checked) return;
        let filter = {_id: doc._id};
        // do something
        if(doc.textHash !== arr[index-1].textHash){
          // TODO send alert
          await diffNotifier(arr[index-1], doc, taskDetail, db);
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

export { taskHistoryChecker, singleTaskHistoryChecker }
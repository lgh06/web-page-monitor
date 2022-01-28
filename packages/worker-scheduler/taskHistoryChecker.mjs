import { getDB, ObjectId } from "./lib/index.mjs"
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
  db.collection(collectionName).find({
    taskId: ObjectId(taskDetail._id),
  }).sort({finishTime: -1}).limit(10).toArray().then(async docs => {
    if(docs && docs.length){
      docs.reverse().forEach(async (doc, index, arr) => {
        let filter = {_id: doc._id};
        console.log(doc)
        if(!doc.checked){
          // do something
          if(doc.err === null && doc.textHash !== null){
            if(doc.textHash !== arr[index-1].textHash){
              // TODO send alert
              console.log('different hash found on taskHistory id', doc._id);
            }
            // other ifs
            if(taskDetail.detectMode){
              console.log(taskDetail.detectMode);
            }

          }
          await db.collection(collectionName).findOneAndUpdate(filter, {
            $set: {
              checked: 1,
            }
          })
        }
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
  db = db || await getDB();
  const collection = db.collection('taskHistory')
  const changeStream = collection.watch();
  // https://docs.mongodb.com/v5.0/changeStreams
  // https://docs.mongodb.com/v5.0/reference/change-events
  changeStream.on('change', next => {
    console.log(next)
  })
}

// taskHistoryChecker();

export { taskHistoryChecker, singleTaskHistoryChecker }
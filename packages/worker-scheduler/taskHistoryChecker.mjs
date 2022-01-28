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
  await errorChecker(db)
}
/**
 * 
 * @param {Db} db 
 */
async function errorChecker (db){
  db = db || await getDB();
  db.collection(collectionName).find({
    taskId: ObjectId('61f3a300410c05a636f632d9'),
  }).sort({finishTime: -1}).limit(10).toArray().then(async docs => {
    if(docs && docs.length){
      docs.reverse().forEach(async (doc, index, arr) => {
        let filter = {_id: doc._id};
        console.log(doc)
        if(!doc.checked){
          // do something
          // await db.collection(collectionName).findOneAndUpdate(filter, {
          //   $set: {
          //     checked: 1,
          //   }
          // })
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
async function changesChecker(db){
  db = db || await getDB();
  // db.collection('taskHistory').watch().on('change', async function (change) {})
}

taskHistoryChecker();

export { taskHistoryChecker }
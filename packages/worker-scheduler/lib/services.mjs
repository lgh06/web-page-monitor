import { getDB } from "./lib/index.mjs"
import { MongoClient, Db } from "mongodb";

/** @type Db */
let db = await getDB();

async function getNext1to4MinutesTasks(){
  // https://docs.mongodb.com/v5.0/tutorial/query-arrays/
  // https://docs.mongodb.com/v5.0/reference/operator/query/gte/#mongodb-query-op.-gte
  // https://docs.mongodb.com/drivers/node/v4.3/usage-examples/find/  
  // TODO not worked yet
  db.collection('task').find({}).toArray().then(doc => {
    if(doc){
      return res.status(200).send(doc)
    }else{
      return res.status(200).send('')
    }
  })
}


/**
 * set newly created task's next execute time, from cron syntax.
 * 
 * TODO , should do this thing in `web` side, when one user first 
 * submit one task.
 * @param {*} cronSyntax cronSyntax
 */
async function setNewTaskNextTime(cronSyntax){

}
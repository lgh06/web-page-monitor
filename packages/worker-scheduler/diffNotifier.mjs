import { Db } from "mongodb";
import { getDB } from "./lib/index.mjs";
import * as alertProviders from "./alertProviders/index.mjs";
/**
 * send prevDoc and doc and taskDetail to different alertProviders
 * @param {WithId<Document>} prevDoc 
 * @param {WithId<Document>} doc 
 * @param {*} taskDetail 
 * @param {Db} db 
 */
async function diffNotifier(prevDoc, doc, taskDetail, db) {
  db = db || await getDB();
  console.log('inside diffNotifier');
  if(taskDetail.alertProvider){

  }else{
    taskDetail.alertProvider = 'nodemailer';
    console.log(alertProviders)
    return await alertProviders[taskDetail.alertProvider].exec({prevDoc, doc, taskDetail});
  }
}

export { diffNotifier };
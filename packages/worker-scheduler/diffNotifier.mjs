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
  if(taskDetail.extra && taskDetail.extra.alertProvider){
    // TODO
  }else{
    taskDetail.extra = taskDetail.extra || {};
    taskDetail.extra.alertProvider = 'nodemailer';
  }
  // below value returned by alertProvider
  // will be saved to `task` table's tmpCache field.
  // tmpCache default value is {}.
  let tmpCache = {};
  tmpCache = await alertProviders[taskDetail.extra.alertProvider].exec({prevDoc, doc, taskDetail})
  return tmpCache;
}

export { diffNotifier };
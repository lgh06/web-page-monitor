import { Db } from "mongodb";
import { getDB } from "../lib/index.mjs";
import * as alertProviders from "../alertProviders/index.mjs";
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
  // will be saved to `task` table's cacheOnTask field.
  // cacheOnTask default value is {}.
  let cacheOnTask = {};
  cacheOnTask = await alertProviders[taskDetail.extra.alertProvider].alert({prevDoc, doc, taskDetail})
  return cacheOnTask;
}
/**
 * send current task result and taskDetail to different alertProviders
 * @param {string} matchedWord 
 * @param {*} taskDetail 
 * @param {*} uncuttedResult 
 * @param {*} oneTaskHistory 
 * @param {Db} db 
 */
async function wordAppearNotifier(matchedWord, taskDetail,uncuttedResult, oneTaskHistory, db) {
  db = db || await getDB();
  console.log('inside wordAppearNotifier');
  if(taskDetail.extra && taskDetail.extra.alertProvider){
    // TODO
  }else{
    taskDetail.extra = taskDetail.extra || {};
    taskDetail.extra.alertProvider = 'nodemailer';
  }

  let cacheOnTask = {};
  cacheOnTask = await alertProviders[taskDetail.extra.alertProvider].wordAppearAlert({matchedWord, taskDetail, uncuttedResult, oneTaskHistory})
  return cacheOnTask;
}

export { diffNotifier, wordAppearNotifier };
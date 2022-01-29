import { Db } from "mongodb";
/**
 * 
 * @param {WithId<Document>} prevDoc 
 * @param {WithId<Document>} doc 
 * @param {*} taskDetail 
 * @param {Db} db 
 */
async function diffNotifier(prevDoc, doc, taskDetail, db) {
  db = db || await getDB();
  console.log('inside diffNotifier');
  console.log(prevDoc);
  console.log(doc);
  console.log(taskDetail);
}

export { diffNotifier };
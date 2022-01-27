import { getDB, ObjectId } from "./lib/index.mjs"

/**
 * subscribe mongodb record changes
 * and send alerts to alertProviders
 */

async function taskHistoryChecker (db){
  db = db || await getDB();
  // TODO get mongodb collection
  // subscribe mongodb record changes
}

export { taskHistoryChecker }
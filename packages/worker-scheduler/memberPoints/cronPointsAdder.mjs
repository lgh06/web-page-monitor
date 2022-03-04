import { getNextStepMinuteTimestamp, getNextTimeSection } from "../helper.mjs";
import { getDB } from '../lib/index.mjs';

async function normalAdder(now){
  now = now || Date.now(); // timestamp
  let db = await getDB();
  if (!db) return;
  let tableName = 'user';
  return db.collection(tableName).aggregate([
    {
      $match: {
        nextAddPointsTime: {
          $gte: getNextStepMinuteTimestamp(now, 5, 1),
          $lt: getNextStepMinuteTimestamp(now, 5, 2)
        },
        points: {
          $not: { $gt: 80 } 
        }
        // TODO pagination and be careful for memory leak. future.
      },
    },
  ]).toArray().then(docs => {
    if (docs && docs.length) {

      docs.forEach(doc => {
        // TODO VIP points add another integer
        db.collection(tableName).updateOne({ _id: doc._id }, {
          '$set': {
            nextAddPointsTime: new Date(now).valueOf() + 3600 * 1000 * 24 * 31 + 300 * 1000 * 10,
            points: 80,
          }
        }).catch(e => console.error(e))
      });
    }
  }).catch(e => console.error(e));
}

async function errorAdder(now){
  now = now || Date.now(); // timestamp
  let db = await getDB();
  if (!db) return;

  let tableName = 'user';

  return db.collection(tableName).aggregate([
    {
      $match: {
        $or: [
          {
            nextAddPointsTime: {
              $lt: getNextStepMinuteTimestamp(now, 5, 1)
            }
          },
          {
            nextAddPointsTime: {
              $exists: false
            }
          },
        ],
        points: {
          $not: { $gt: 80 } 
        }
        // TODO pagination and be careful for memory leak. future.
      },
    },
  ]).toArray().then(docs => {
    if (docs && docs.length) {
      // TODO VIP points add another integer
      docs.forEach(doc => {
        db.collection(tableName).updateOne({ _id: doc._id }, {
          '$set': {
            nextAddPointsTime: new Date(now).valueOf() + 3600 * 1000 * 24 * 31 + 300 * 1000 * 10,
            points: 80,
          }
        }).catch(e => console.error(e))
      });
    }
  }).catch(e => console.error(e));

}

export { normalAdder, errorAdder} 
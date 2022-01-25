import { getDB, ObjectId } from './lib/index.mjs';
import { CronTime } from '@webest/web-page-monitor-helper';


let getNextStepMinuteTimestamp = function (timestamp, step = 5, count = 1) {
  let nextStepMinute = parseInt((new Date(timestamp).getMinutes() + count * step) / step) * step;
  let nextHour = 0;
  if (nextStepMinute >= 60) {
    nextHour = parseInt(nextStepMinute / 60)
    nextStepMinute = nextStepMinute % 60;
    // console.log('inside above', nextHour, nextStepMinute, count)
  } else {
    nextHour = 0;
    // console.log('inside below', nextHour, nextStepMinute, count)
  }
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setHours
  let nextStepMinuteTimestamp = new Date(timestamp).setHours(
    new Date(timestamp).getHours() + nextHour,
    nextStepMinute,
    0,
    0
  );
  // console.log(nextHour, nextStepMinute, nextStepMinuteTimestamp);
  return nextStepMinuteTimestamp;
}

let getNextTimeSection = function (timestamp, step, count = 1) {
  return [
    // new Date(
    getNextStepMinuteTimestamp(timestamp, step, count)
    // )
    ,
    // new Date(
    getNextStepMinuteTimestamp(timestamp, step, count + 1) - 1
    // )
  ]
}
// if now is 1 minute, then return the first one who matches >= 10:00 
// if now is 6 minute, then return the first one who matches >= 15:00 
let timestampArrayFinderGenerator = (nowTimestamp) => (v) => {
  return (v >= getNextStepMinuteTimestamp(nowTimestamp, 5, 2))
}

async function normalChecker(now) {

  now = now || Date.now(); // timestamp

  let db = await getDB();
  if (!db) return;

  let tableName = 'task';

  let finder = timestampArrayFinderGenerator(now);

  return db.collection(tableName).aggregate([
    {
      $match: {
        nextExecuteTime: {
          $gte: getNextStepMinuteTimestamp(now, 5, 1),
          $lt: getNextStepMinuteTimestamp(now, 5, 2)
        }
      }
      // TODO pagination and be careful for memory leak. future.
    },
    {
      // userId in task collection is a normal string,
      // not an ObjectId. so need convert
      $addFields: {
        userObjectId: { $toObjectId: "$userId" }
      }
    },
    {
      $lookup:
      {
        from: "user",
        localField: "userObjectId",
        foreignField: "_id",
        as: "user"
      }
    },
    // {
    //   $project:
    //   {
    //     _id: 1,
    //     user: 1,
    //     cronSyntax: 1,
    //     nextExecuteTime:1,
    //   }
    // }

  ])
  // .find({
  //   nextExecuteTime: {
  //     $gte: getNextStepMinuteTimestamp(now, 5, 1),
  //     $lt: getNextStepMinuteTimestamp(now, 5, 2)
  //   }
  //   // TODO pagination and be careful for memory leak. future.
  // })
  .toArray().then(docs => {
    if (docs && docs.length) {
      docs.forEach(doc => {
        // TODO send jobs to MQ and execute quicker
        console.log('inside normal checker')
        console.log(doc)
        db.collection(tableName).updateOne({ _id: doc._id }, {
          '$set': {
            nextExecuteTime: CronTime.getNextTimes(doc.cronSyntax, 5).find(finder)
          }
        }).catch(e => console.log(e))
      });
    }
  }).catch(e => console.log(e));
}

async function errorChecker(now) {

  now = now || Date.now(); // timestamp

  let db = await getDB();
  if (!db) return;

  let tableName = 'task';

  let finder = timestampArrayFinderGenerator(now);

  // https://docs.mongodb.com/v5.0/reference/operator/aggregation-pipeline/
  // https://docs.mongodb.com/v5.0/reference/operator/aggregation/match
  // https://docs.mongodb.com/v5.0/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup
  // https://docs.mongodb.com/v5.0/reference/operator/aggregation/lookup/#use--lookup-with--mergeobjects
  // https://docs.mongodb.com/v5.0/reference/operator/aggregation/mergeObjects/#-mergeobjects
  // https://docs.mongodb.com/v5.0/reference/operator/aggregation/replaceRoot/#-replaceroot--aggregation-
  // https://docs.mongodb.com/drivers/node/v4.3/fundamentals/aggregation
  return db.collection(tableName).aggregate([
    {
      $match: {
        $and: [
          {
            nextExecuteTime: {
              $lt: getNextStepMinuteTimestamp(now, 5, 1)
            }
          },
          {
            endTime: {
              $gt: now
            }
          },
        ]
        // TODO pagination and be careful for memory leak. future.
      },
    },
    {
      // userId in task collection is a normal string,
      // not an ObjectId. so need convert
      $addFields: {
        userObjectId: { $toObjectId: "$userId" }
      }
    },
    {
      $lookup:
      {
        from: "user",
        localField: "userObjectId",
        foreignField: "_id",
        as: "user"
      }
    },
    // {
    //   $project:
    //   {
    //     _id: 1,
    //     user: 1,
    //     cronSyntax: 1,
    //     nextExecuteTime:1,
    //   }
    // }
  ]).toArray().then(docs => {
    if (docs && docs.length) {

      docs.forEach(doc => {
        // TODO send jobs to MQ and execute quicker
        console.log('inside erro checker')
        console.log(doc)
        db.collection(tableName).updateOne({ _id: doc._id }, {
          '$set': {
            nextExecuteTime: CronTime.getNextTimes(doc.cronSyntax, 5).find(finder)
          }
        }).catch(e => console.log(e))
      });
    }
  }).catch(e => console.log(e));

}


export { normalChecker, errorChecker, getNextStepMinuteTimestamp, getNextTimeSection }
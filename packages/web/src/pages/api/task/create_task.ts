// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, ObjectId } from '../../../lib';
import { CronTime } from '@webest/web-page-monitor-helper';
import { mongo } from '@webest/web-page-monitor-helper/node';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let {
    cronSyntax,
    endTime,
    cssSelector,
    pageURL,
    userId,
    mode,
    extra,
  } = req.body.taskDetail;

  // endTime in DB is a Date type
  // need convert timestamp int to Date type
  if(typeof endTime !== 'object') {
    endTime = new Date(endTime);
  }

  let passed = false, errorMsg = [''];
  // get next 5 times
  let nextExecuteTimeArr = CronTime.getNextTimes(cronSyntax, 50);
  // check time between
  [passed, errorMsg] = CronTime.checkTimes(nextExecuteTimeArr);
  // ensure syntax not contain '/'
  if (String(cronSyntax).includes('/')) {
    [passed, errorMsg] = [false, ['Please remove / in your syntax, see FAQ for details']]
  }
  // TODO verify endTime, and user if have enough points to create new task.
  let nextExecuteTime;
  let nowTimestamp = Date.now();
  if (nextExecuteTimeArr && nextExecuteTimeArr.length && passed) {
    // find 15 minutes later cron time.
    // because we need time to distribute tasks in first time.
    // TODO enhance in future.
    nextExecuteTime = nextExecuteTimeArr.find(v => (v >= nowTimestamp + 15 * 60 * 1000));
  } else {
    return res.status(400).json({ err: 'please check input value.' + Array(errorMsg).join(' ') })
  }
  // have chance not got nextExecuteTime
  if (!nextExecuteTime) {
    return res.status(400).json({ err: 'please check input value.' + Array(errorMsg).join(' ') })
  }
  if(typeof userId === 'string'){
    userId = new ObjectId(userId);
  }
  const newDoc = {
    cronSyntax, endTime, cssSelector, pageURL, userId, mode, nextExecuteTime,
    extra,
  };

  let filter = {
    cronSyntax,
    pageURL,
    cssSelector,
    userId,
    mode,
  }
  let db = await getDB();
  // create index for task collection
  // we often need to find task by nextExecuteTime and endTime in worker.
  // https://docs.mongodb.com/v5.0/core/index-compound/
  if (db) {
    // TODO MongDB authentication and authorization
    // create different users and passwords and roles
    // TODO below index should be deleted once we have first user.
    db.collection("task").createIndex({ endTime: 1 }, { expireAfterSeconds: 3600 * 24 * 130 });
    db.collection("task").createIndex({ nextExecuteTime: 1, endTime: 1, });
    db.collection("task").createIndex({ userId: 1, endTime: -1, });
    db.collection("taskHistory").createIndex({ taskId: 1, finishTime: -1 });
    db.collection("taskHistory").createIndex({ finishTime: 1 }, { expireAfterSeconds: 3600 * 24 * 130 });
  }
  return mongo.upsertDoc(db, 'task', filter, newDoc, res)
}

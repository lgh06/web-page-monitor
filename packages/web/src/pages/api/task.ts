// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, middlewares, ObjectId, NextApiRequestWithUserInfo } from '../../lib';
import { CronTime } from '@webest/web-page-monitor-helper';
import { mongo } from '@webest/web-page-monitor-helper/node';
import { ESMLoader } from "@webest/web-page-monitor-esm-loader"



const collectionName = 'task';


async function _postHandler(
  req: NextApiRequestWithUserInfo,
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
    _id,
    customScript,
  } = req.body.taskDetail;
  userId = req.userInfo._id || userId;


  let customScriptCheckPassed = false;
  if (mode === 'custom') {
    // customScript length check
    if(!customScript || String(customScript).length > 1000 ){
      return res.status(400).json({ err: 'please check input value.' });
    }
    // customScript safe check
    if( String(customScript).match(/require|import|fetch|global|process/g) ){
      return res.status(400).json({ err: 'cannot contain "require" / "import" / "fetch" / "global" / "process" inside custom script.' })
    }
    console.log('task js log')
    // parse that custom script to one js module
    let customScriptModule;
    try {
      customScriptModule = await ESMLoader(customScript);
    } catch (error) {
      return res.status(400).json({ err: 'please check input value.' });
    }
    if(customScriptModule 
        && customScriptModule.cronSyntax 
        && customScriptModule.endTime
        && customScriptModule.exec
      ){
        cronSyntax = customScriptModule.cronSyntax;
        endTime = customScriptModule.endTime;
        customScriptCheckPassed = true;
    }
  }

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
  // for easy to compare
  // if one task's first execute time is very far from now.
  if(nextExecuteTime - nowTimestamp >= 1000 * 60 * 30){
    nextExecuteTime = nowTimestamp + 1000 * 60 * 16;
  }
  if(typeof userId === 'string'){
    userId = new ObjectId(userId);
  }
  let newDoc;
  if(mode === 'simp'){
    newDoc = {
      userId, cronSyntax, endTime, cssSelector, pageURL, mode, nextExecuteTime,
      extra,
    };
  }else if (mode === 'custom') {
    if(!customScriptCheckPassed || !passed){
      return res.status(400).json({ err: 'please check input value.' })
    }
    newDoc = {
      userId, cronSyntax, endTime, mode, nextExecuteTime, customScript,
      extra, // extra inside have task alias, keep that for now.
    }
  }

  let filter = {
    _id: new ObjectId(_id),
  }
  if(!_id){
    delete filter._id;
  }
  let db = await getDB();
  // create index for task collection
  // we often need to find task by nextExecuteTime and endTime in worker.
  // https://docs.mongodb.com/v5.0/core/index-compound/
  // https://docs.mongodb.com/v5.0/core/index-sparse
  if (db) {
    // TODO MongDB authentication and authorization
    // create different users and passwords and roles
    // TODO below index should be deleted once we have first user.
    // keep task for 60 days after endTime
    db.collection("task").createIndex({ endTime: 1 }, { expireAfterSeconds: 3600 * 24 * 60 });
    db.collection("task").createIndex({ nextExecuteTime: 1, endTime: 1, });
    db.collection("task").createIndex({ userId: 1, endTime: -1, });
    db.collection("taskHistory").createIndex({ taskId: 1, finishTime: -1 });
    // keep taskHistory for 30 days after finishTime
    db.collection("taskHistory").createIndex({ finishTime: 1 }, { expireAfterSeconds: 3600 * 24 * 30 });
  }
  let userTaskCount = await db.collection("task").countDocuments({
    userId,
  });
  if( (!_id && userTaskCount >= 5) || (_id && userTaskCount >= 7)){
    return res.status(400).json({ err: 'user task count is over 5' })
  }
  return mongo.upsertDoc(db, 'task', filter, newDoc, res, true);
}

async function _deleteHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
){
  let db = await getDB();
  let id = req.query.id as string;
  // TODO auth this task belongs to current user
  if(id){
    return mongo.delOneDoc(db, collectionName, { _id: new ObjectId(id) }, res)
  }else{
    res.status(404).json({ err: 'no param'})
  }
}

async function _getHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
){
  let db = await getDB();
  let collectionName = 'task';
  let userId = req.query.userId as string;
  let id = req.query.id as string;

  let condition = {};
  let project = null;
  if(userId){
    // a list
    if(req.userInfo._id && userId !== req.userInfo._id){
      return res.status(401).json({ err: 'forbidden'})
    }
    condition = { userId: new ObjectId(userId) };
    // project = {value: 0};
  }else if(id){
    // one list contains a single object
    condition =  { _id: new ObjectId(id) };
  }else{
    return res.status(404).json({ err: 'no param'})
  }
  return mongo.queryDoc(db, collectionName, condition, project, res)
}

async function _handler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
) {
  if(req.method === 'POST'){
    await _postHandler(req, res);
  }else if(req.method === 'DELETE'){
    await _deleteHandler(req, res);
  }else if(req.method === 'GET'){
    await _getHandler(req, res);
  }else{
    res.status(400).json({ err: 'no method match' })
  }
}

export default middlewares.authJwt(_handler);
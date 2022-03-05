// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, ObjectId, middlewares, NextApiRequestWithUserInfo } from '../../../lib';
import { CronTime } from '@webest/web-page-monitor-helper';
import { mongo } from '@webest/web-page-monitor-helper/node';

async function scriptPostHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
){

  let {
    alias,
    value,
    userId,
    domainArr,
    _id,
  } = req.body.scriptDetail;
  userId = req.userInfo._id || userId;

  if(typeof userId === 'string'){
    userId = new ObjectId(userId);
  }

  let newDoc = {
    userId,
    alias,
    value,
    domainArr,
  };
  let filter = {
    userId,
    _id: new ObjectId(_id),
  }
  if(!_id){
    delete filter._id;
    delete filter.userId;
  }
  // res.status(200).json({ name: 'John Doe', body: req.body })
  let db = await getDB();
  let collectionName = 'script';
  if(db){
    let table = db.collection(collectionName);
    table.createIndex({ domainArr: 1 });
    table.createIndex({ userId: 1 });
    table.createIndex({ alias: 1 });
    table.createIndex({ private: 1 });
  }

  let userScriptCount = await db.collection(collectionName).countDocuments({
    userId,
  });
  if( (!_id && userScriptCount >= 3) || (_id && userScriptCount >= 6)){
    return res.status(400).json({ err: 'user script count is over 3' })
  }

  // TODO one user can only have max 3 scripts
  // VIP can have 10 script (maybe)
  return mongo.upsertDoc(db, collectionName, filter, newDoc, res)
}

async function scriptDeleteHandler(
  req: NextApiRequest,
  res: NextApiResponse
){
  let db = await getDB();
  let collectionName = 'script';
  let id = req.query.id as string;
  if(id){
    // TODO auth this script belongs to current user
    // one list contains a single object
    return mongo.delOneDoc(db, collectionName, { _id: new ObjectId(id) }, res)
  }else{
    res.status(404).json({ err: 'no param'})
  }
}

async function scriptGetHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
){
  let db = await getDB();
  let collectionName = 'script';
  let userId = req.query.userId as string;
  let id = req.query.id as string;
  let alias = req.query.alias as string;
  let domain = req.query.domain as string;
  if(userId){
    // a list
    if(req.userInfo._id && userId !== req.userInfo._id){
      return res.status(401).json({ err: 'forbidden'})
    }
    return mongo.queryDoc(db, collectionName, { userId: new ObjectId(userId) }, {value: 0}, res)
  }else if(id){
    // one list contains a single object
    return mongo.queryDoc(db, collectionName, { _id: new ObjectId(id) }, null, res)
  }else if(alias){
    // a list
    return mongo.queryDoc(db, collectionName, { alias }, null, res)
  }else if(domain){
    // a list
    return mongo.queryDoc(db, collectionName, { domainArr: domain }, null, res)
  }else{
    res.status(404).json({ err: 'no param'})
  }
}

async function _handler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
) {
  if(req.method === 'POST'){
    await scriptPostHandler(req, res);
  }else if(req.method === 'DELETE'){
    await scriptDeleteHandler(req, res);
  }else if(req.method === 'GET'){
    await scriptGetHandler(req, res);
  }else{
    res.status(400).json({ err: 'no method match' })
  }
}

export default middlewares.authJwt(_handler);
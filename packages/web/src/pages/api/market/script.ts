// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, ObjectId } from '../../../lib';
import { CronTime } from '@webest/web-page-monitor-helper';
import { mongo } from '@webest/web-page-monitor-helper/node';

async function scriptPostHandler(
  req: NextApiRequest,
  res: NextApiResponse
){

  let {
    alias,
    value,
    userId,
    urlRegExpArr,
    _id,
  } = req.body.scriptDetail;
  let newDoc = {
    alias,
    value,
    userId: new ObjectId(userId),
    urlRegExpArr,
  };
  let filter = {
    userId: new ObjectId(userId),
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
    table.createIndex({ urlRegExpArr: 1 });
    table.createIndex({ userId: 1 });
    table.createIndex({ alias: 1 });
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
    // one list contains a single object
    return mongo.delOneDoc(db, collectionName, { _id: new ObjectId(id) }, res)
  }else{
    res.status(404).json({ err: 'no param'})
  }
}

async function scriptGetHandler(
  req: NextApiRequest,
  res: NextApiResponse
){
  let db = await getDB();
  let collectionName = 'script';
  let userId = req.query.userId as string;
  let id = req.query.id as string;
  if(userId){
    // a list
    return mongo.queryDoc(db, collectionName, { userId: new ObjectId(userId) }, {value: 0}, res)
  }else if(id){
    // one list contains a single object
    return mongo.queryDoc(db, collectionName, { _id: new ObjectId(id) }, null, res)
  }else{
    res.status(404).json({ err: 'no param'})
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === 'POST'){
    await scriptPostHandler(req, res);
  }else if(req.method === 'DELETE'){
    await scriptDeleteHandler(req, res);
  }else if(req.method === 'GET'){
    await scriptGetHandler(req, res);
  }else{
    res.status(200).json({ err: 'no method match' })
  }
}
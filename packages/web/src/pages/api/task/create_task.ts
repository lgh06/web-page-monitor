// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB } from '../../../lib';
import { CronTime, mongo } from '@webest/web-page-monitor-helper';
import { ReturnDocument } from 'mongodb';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  let db = await getDB();

  const { cronSyntax, endTime, cssSelector,pageURL, userId, mode } = req.body;

  const filter = { cronSyntax, endTime, cssSelector,pageURL, userId, mode };
  // TODO verify the cron's between time and syntax , like frontend side.
  let nextExecuteTimeArr = CronTime.getNextTimes(cronSyntax, 1);
  let nextExecuteTime;
  if (nextExecuteTimeArr && nextExecuteTimeArr[0]){
    nextExecuteTime = nextExecuteTimeArr[0]
  }else{
    res.status(400).json({ value: 'please check input value' })
  }
  const newDoc = { cronSyntax, endTime, cssSelector,pageURL, userId, mode, nextExecuteTime };
  console.log(newDoc)
  const options = { upsert: true, returnDocument: ReturnDocument.AFTER };
  // TODO
  // db.collection('task').findOneAndReplace(filter, newDoc , options).then(doc => {
  //   return res.status(200).json(doc)
  // }).catch((e)=>{
  //   return res.status(500).json({ value: e });
  // });
  mongo.upsertDoc(db, 'task', newDoc).then(doc => {
    return res.status(200).json(doc)
  }).catch((e)=>{
    return res.status(500).json({ value: e });
  });
}

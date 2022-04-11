// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, middlewares, ObjectId, NextApiRequestWithUserInfo } from '../../../lib';
import { CronTime } from '@webest/web-page-monitor-helper';
import { mongo } from '@webest/web-page-monitor-helper/node';


const collectionName = 'task';


async function _postHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
) {

}

async function _deleteHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
){

}

async function _getHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
){
  let db = await getDB();
  let collectionName = 'taskHistory';
  let taskId = req.query.taskId as string;

  let condition = {};
  let project = null;
  if(taskId){
    // one list contains a single object
    condition =  { taskId: new ObjectId(taskId) };
  }else{
    return res.status(404).json({ err: 'no param'})
  }
  if( (!db) && res) return res.status(500).send('db lost');
  let p = db.collection(collectionName).find( condition )
            .sort({finishTime: -1}).limit(1000).toArray().then(returnedDoc => {
    return returnedDoc
  })

  p.then(doc => {
      return res.setHeader("Cache-Control", "max-age=3600").status(200).json(doc)
    }).catch((e) => {
      return res.status(500).json({ err: e });
    });
  return p;
}

async function _handler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
) {
if(req.method === 'GET'){
    await _getHandler(req, res);
  }else{
    res.status(400).json({ err: 'no method match' })
  }
}

export default middlewares.authJwt(_handler);
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ObjectId, ReturnDocument } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, middlewares, NextApiRequestWithUserInfo } from '../../lib';
import { mongo, jwt } from '@webest/web-page-monitor-helper/node';

let collectionName = 'user';


async function userPostHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO enhancement
  const { email, emailVerified, oauthProvider } = req.body;
  const filter = { email };
  const newDoc = {email, emailVerified, oauthProvider};

  let db = await getDB();
  db?.collection('user').createIndex({ email: 1 }, {unique: true});
  db?.collection('user').createIndex({ nextAddPointsTime: 1 });
  let returnedDoc;
  try {
    returnedDoc = await mongo.upsertDoc(db, 'user', filter, newDoc);
    const { value: { email, _id, nextAddPointsTime, points } } = returnedDoc;
    // if one user not have nextAddPointsTime yet
    // (a new user)
    if(!nextAddPointsTime){
      await db.collection(collectionName).updateOne({ _id }, 
        { $set: { 
            nextAddPointsTime: Date.now() + 3600 * 1000 * 24 * 31,
            points: 80,
          } 
        });
    }
    const jwtToken = await jwt.sign({ email, _id});
    res.status(200).json({...returnedDoc, jwtToken});
  } catch (e) {
    res.status(500).json({ err: e });
  }
}

async function userGetHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
) {
  let db = await getDB();
  let id = String (req.userInfo._id || req.query.id);

  let condition = { _id: new ObjectId(id) };
  let project = {nextAddPointsTime: 1, points: 1, _id: 0}
  res.setHeader("Cache-Control", "max-age=30")

  await mongo.queryDoc(db, collectionName, condition, project, res)
}



async function _handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === 'POST'){
    await middlewares.cors(userPostHandler)(req, res);
  }else if(req.method === 'DELETE'){
  }else if(req.method === 'GET'){
    await middlewares.authJwt(userGetHandler)(req, res);
  }else{
    res.status(400).json({ err: 'no method match' })
  }
}

export default _handler;

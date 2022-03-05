// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ReturnDocument } from 'mongodb';
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
    const { value: { email, _id } } = returnedDoc;
    console.log(returnedDoc)
    const jwtToken = await jwt.sign({ email, _id});
    return res.status(200).json({...returnedDoc, jwtToken});
  } catch (e) {
    return res.status(500).json({ err: e });
  }
}

async function userGetHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
) {
  let db = await getDB();
  let id = req.query.id as string;
  res.json({
    userIdFromJwt: req.userInfo._id,
    userIdFromReq: id,
  })
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

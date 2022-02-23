// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ReturnDocument } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, middlewares } from '../../../lib';
import { mongo, jwt } from '@webest/web-page-monitor-helper/node';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO enhancement
  const { email, emailVerified, oauthProvider } = req.body;
  const filter = { email };
  const newDoc = {email, emailVerified, oauthProvider};

  let db = await getDB();
  db?.collection('user').createIndex({ email: 1 }, {unique: true});
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

export default middlewares.cors(handler);

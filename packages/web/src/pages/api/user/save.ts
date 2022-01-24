// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ReturnDocument } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB } from '../../../lib';
import { mongo } from '@webest/web-page-monitor-helper/node';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let db = await getDB();
  // TODO enhancement
  const { email, emailVerified, oauthProvider } = req.body;
  console.log(req.body, req.body.email)
  const filter = { email };
  const newDoc = {email, emailVerified, oauthProvider};
  console.log(newDoc)

  mongo.upsertDoc(db, 'user', filter, newDoc, res)
}

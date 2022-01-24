// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ReturnDocument } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB } from '../../../lib';


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
  const options = { upsert: true, returnDocument: ReturnDocument.AFTER };

  // https://docs.mongodb.com/manual/reference/operator/update/#update-operators

  // https://docs.mongodb.com/drivers/node/v4.3/usage-examples/updateOne/
  // https://mongodb.github.io/node-mongodb-native/4.3/classes/Collection.html#updateOne
  // https://mongodb.github.io/node-mongodb-native/4.3/classes/Collection.html#findOneAndUpdate\

  // https://docs.mongodb.com/drivers/node/v4.3/usage-examples/replaceOne/
  // https://mongodb.github.io/node-mongodb-native/4.3/classes/Collection.html#replaceOne
  // https://mongodb.github.io/node-mongodb-native/4.3/classes/Collection.html#findOneAndReplace

  return db.collection('user').findOneAndReplace(filter, newDoc , options).then(doc => {
    // TODO hide password
    return res.status(200).json(doc)
  })
}

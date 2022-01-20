// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB } from '../lib';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log(req.body)
  // console.log(req)
  let db = await getDB();
  // TODO
  db.collection('').insertOne({}).then(doc => {
    if(doc){
      // return res.status(200).send(doc)
    }else{
      // return res.status(200).send('')
    }
  })
  res.status(200).json({ test: "test", body: req.body })
}

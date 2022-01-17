// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB } from '../../../lib';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { str } = req.query
  let db = await getDB();

  db.collection('dynjs').findOne({filename: str}).then(doc => {
    if(doc){
      return res.status(200).send(doc.content)
    }else{
      return res.status(200).send('')
    }
  })
}

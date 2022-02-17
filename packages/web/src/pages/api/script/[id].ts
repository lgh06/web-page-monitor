// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, ObjectId } from '../../../lib';

// http://localhost:{port}/dynjs/{filename}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const id = String(req.query.id).replace('.js', '');
  let db = await getDB();
  if (!db) return res.status(500).send('');

  db.collection('script').findOne({_id: new ObjectId(id) }).then(doc => {
    if(doc){
      return res.setHeader('Content-Type', 'text/javascript;charset=UTF-8').status(200).send(doc.value)
    }else{
      return res.status(404).send('')
    }
  }).catch(e => {console.error(e)})
}

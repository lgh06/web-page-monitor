// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, ObjectId, middlewares } from '../../../lib';

// http://localhost:{port}/script/{id}.js
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const id = String(req.query.id).replace('.js', '');
  if(String(id).length !== 24){
    res.status(404).json({ err: 'script id must be 24 chars'});
    return;
  }
  let db = await getDB();
  if (!db) return res.status(500).send('');

  let doc = await db.collection('script').findOne({_id: new ObjectId(id) });
  if(doc){
    return res.setHeader('Content-Type', 'text/javascript;charset=UTF-8').status(200).send(doc.value)
  }else{
    return res.status(404).send('')
  }
}

export default middlewares.addRequestId(handler);

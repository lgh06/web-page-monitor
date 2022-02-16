// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, ObjectId } from '../../../lib';
import { CronTime } from '@webest/web-page-monitor-helper';
import { mongo } from '@webest/web-page-monitor-helper/node';

function eraserPUTHandler(
  req: NextApiRequest,
  res: NextApiResponse
){

  res.status(200).json({ name: 'John Doe', body: req.body })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === 'PUT'){
    eraserPUTHandler(req, res)
  }else{
    res.status(200).json({ err: 'no method match' })
  }
}
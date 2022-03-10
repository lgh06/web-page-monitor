// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, ObjectId, middlewares, NextApiRequestWithUserInfo } from '../../../lib';
import { CronTime } from '@webest/web-page-monitor-helper';
import { mongo, jwt } from '@webest/web-page-monitor-helper/node';

import { fetchAPI } from "../../../helpers/httpHooks"
import crypto from 'crypto';
import { ReturnDocument } from 'mongodb';

const md5 = (str) => crypto.createHash('md5').update(str).digest('hex').toUpperCase();


export default async function wxPayNotifyHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
) {
  const secret = process.env.NEXT_WX_PAY_SECRET

  let {order_id = "", pay_price = 0, aoid, pay_time, sign} = req.body;
  let signCalculated = md5(aoid + order_id + pay_price + pay_time + secret);
  console.log('signCalculated', signCalculated)
  console.log('signFromRequest', sign)
  // TODO auth order from sign
  console.log('wxPayNotifyHandler order_id pay_price', order_id, pay_price);
  if(order_id && pay_price){
    let email = order_id.substring(0, order_id.length - 9);
    
    let db = await getDB();
    if(!db){
      return res.status(500).json({err: 'db is not ready'})
    }

    const options = { upsert: false, returnDocument: ReturnDocument.AFTER };
    let result = await db.collection('user').findOneAndUpdate({email}, {
      $inc: {
        points: pay_price * 100,
      },
      options
    });

    let { ok, value = {} } = result;
    if(ok){
      let {points = 0} = value as any;
      return res.status(200).json({points})
    }else{
      return res.status(500).json({err: 'update user points failed'})
    }

  }
  res.status(400).json({err:'bad request'});
}
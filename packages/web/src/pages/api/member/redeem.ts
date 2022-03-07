// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, ObjectId, middlewares, NextApiRequestWithUserInfo } from '../../../lib';
import { CronTime } from '@webest/web-page-monitor-helper';
import { mongo } from '@webest/web-page-monitor-helper/node';

async function memberRedeemHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
){

  let {
    userId,
    coupon
  } = req.body.redeemInfo;
  userId = req.userInfo._id || userId;

  if(typeof userId === 'string'){
    userId = new ObjectId(userId);
  }

  coupon = Number(coupon);
  if(Number.isNaN(coupon)){
    coupon = 1;
  }

  // TODO verify coupon and its price
  // one RMB = 100 cents = 100 coupon
  // 10 RMB = 1000 cents = 1000 coupon

  // res.status(200).json({ name: 'John Doe', body: req.body })
  let db = await getDB();
  let collectionName = 'user';

  await db.collection(collectionName).updateOne({_id: userId}, {
    $inc: {
      points: coupon,
    },
  });

  res.json({});

}

async function _handler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
) {
  if(req.method === 'POST'){
    await memberRedeemHandler(req, res);
  }else if(req.method === 'DELETE'){
  }else{
    res.status(400).json({ err: 'no method match' })
  }
}

export default middlewares.authJwt(_handler);
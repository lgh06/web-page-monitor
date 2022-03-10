// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, ObjectId, middlewares, NextApiRequestWithUserInfo } from '../../../lib';
import { CronTime } from '@webest/web-page-monitor-helper';
import { mongo, jwt } from '@webest/web-page-monitor-helper/node';

async function memberRedeemHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
){
  let collectionName = 'couponUsed';

  let {
    userId,
    coupon
  } = req.body.redeemInfo;
  userId = req.userInfo._id || userId;

  if(typeof userId === 'string'){
    userId = new ObjectId(userId);
  }

  let jwtResult = await jwt.verifyJwt(coupon);
  if(jwtResult.verified){


    // one RMB = 100 cents = 100 points
    // 10 RMB = 1000 cents = 1000 points

    let db = await getDB();

    let couponUsedResult = await mongo.queryDoc(db, collectionName, { couponId: jwtResult.payload.couponId}, {});
    if(couponUsedResult && couponUsedResult.length > 0){
      return res.json({ err: 'Coupon is used before' })
    }
    if(jwtResult.payload.expire < Date.now()){
      return res.json({ err: 'Coupon is expired.' })
    }

    await db.collection('user').updateOne({_id: userId}, {
      $inc: {
        points: Math.floor(jwtResult.payload.points),
      },
    });

    await db.collection(collectionName).createIndex({couponId: 1});
    let couponFilter = {
      couponId: jwtResult.payload.couponId,
    }
    await mongo.upsertDoc(db, collectionName, couponFilter, jwtResult.payload)

    res.json({addedPoints: jwtResult.payload.points})

  }else{
    return res.status(400).json({ err: 'coupon is invalid' })
  }


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
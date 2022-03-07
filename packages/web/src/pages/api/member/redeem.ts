// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, ObjectId, middlewares, NextApiRequestWithUserInfo } from '../../../lib';
import { CronTime } from '@webest/web-page-monitor-helper';
import { mongo, jwt } from '@webest/web-page-monitor-helper/node';

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

  let jwtResult = await jwt.verifyJwt(coupon);
  if(jwtResult.verified){

    // TODO see if the coupon is used before

    // TODO verify coupon and its points
    // one RMB = 100 cents = 100 points
    // 10 RMB = 1000 cents = 1000 points

    let db = await getDB();
    let collectionName = 'user';

    await db.collection(collectionName).updateOne({_id: userId}, {
      $inc: {
        points: jwtResult.jwt.points,
      },
    });

    res.json({addedPoints: jwtResult.jwt.points})

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
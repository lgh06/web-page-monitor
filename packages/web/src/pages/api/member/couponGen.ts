// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, ObjectId, middlewares, NextApiRequestWithUserInfo } from '../../../lib';
import { CronTime } from '@webest/web-page-monitor-helper';
import { mongo, jwt } from '@webest/web-page-monitor-helper/node';

async function couponGenHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
){

  let now = Date.now()
  let { pwd } = req.query;

  // below value used in browser console or command line nodejs
  function getPwd(salt, seconds){
    salt = Number(salt || '100');
    seconds = Number(seconds || '360');
    let nowHour = Math.floor(Date.now() / 1000 / seconds);
    let generatedPwd = Number(nowHour + salt).toString(36);
    return generatedPwd;
  }

  let salt = process.env.COUPON_GEN_PWD_SALT;
  let seconds = process.env.COUPON_GEN_PWD_SECONDS;

  let generatedPwd = getPwd(salt, seconds);

  if( pwd !== generatedPwd ){
    return res.status(400).json({ err: 'Unauth' })
  }


  let couponId, points, expire;

  // TODO add extra auth for this API
  // let admin user use only.

  // TODO backup jwt certs in other places
  // or all coupons cannot be verified!!


  couponId = couponId || now.toString(36).toUpperCase();
  points = points || 1000;
  // one coupon expires after 90 days
  expire = now + 3600 * 1000 * 24 * 90;


  let oneCoupon = {
    couponId,
    points,
    expire,
  }

  let signedCoupon = await jwt.sign(oneCoupon);

  // we do not store coupon when generate them,
  // we store coupon info when it be consumed.

  res.json({signedCoupon});

}

async function _handler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
) {
  if(req.method === 'GET'){
    await couponGenHandler(req, res);
  }else if(req.method === 'DELETE'){
  }else{
    res.status(400).json({ err: 'no method match' })
  }
}

export default middlewares.cors(_handler);
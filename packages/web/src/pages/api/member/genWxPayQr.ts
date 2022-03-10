// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { middlewares, NextApiRequestWithUserInfo } from '../../../lib';

import { fetchAPI } from "../../../helpers/httpHooks"
import crypto from 'crypto';

async function genWxPayQrHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
){
  
  try {
    let { email, amountYuan } = req.body;

    let orderId = email+ '_' + Math.floor(Date.now()/1000).toString(36)


    const aid = process.env.NEXT_WX_PAY_AID
    const secret = process.env.NEXT_WX_PAY_SECRET
    
    const md5 = (str) => crypto.createHash('md5').update(str).digest('hex').toUpperCase();
    
    let payData = {
      'name': '阿欢电脑配件',
      'pay_type': 'native',
      'price': amountYuan,
      'order_id': orderId,
      'notify_url': 'http://monit.or.passby.me/api/member/wxpaynotify',
    };
    
    //签名
    payData['sign'] = md5(payData['name'] + payData['pay_type'] + payData['price'] + payData['order_id'] + payData['notify_url'] + secret);
    
    let queryString = Object.entries(payData).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');

    let fetchHeaders = {};
    fetchHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
    let promisedFetchResp = fetch('https://xorpay.com/api/pay/' + aid, {
      method: 'POST',
      headers: fetchHeaders,
      redirect: 'follow',
      body: queryString,
    });

    let jsonResult = await promisedFetchResp.then(r => r.json());

    res.status(200).setHeader('Cache-Control', 'max-age=0').json({
      jsonResult,
    })
    
  } catch (error) {
    res.status(500).json({err: error})
  }
}

export default middlewares.authJwt(genWxPayQrHandler);
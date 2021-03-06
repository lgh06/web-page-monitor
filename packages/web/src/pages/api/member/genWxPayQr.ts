// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { middlewares, NextApiRequestWithUserInfo } from '../../../lib';

import { fetchAPI } from "../../../helpers/httpHooks"
import crypto from 'crypto';

const md5 = (str) => crypto.createHash('md5').update(str).digest('hex').toUpperCase();


async function genWxPayQrHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
){
  
  try {
    let { email, amountYuan } = req.body;

    let orderId = email+ '_' + Date.now().toString(36)

    const aid = process.env.NEXT_WX_PAY_AID
    const secret = process.env.NEXT_WX_PAY_SECRET

    if(!aid || !secret){
      return res.status(500).json({err: 'aid or secret is not set'})
    }

    let payData = {
      'name': '阿欢电脑配件' + '_' + amountYuan,
      'pay_type': 'native',
      'price': amountYuan,
      'order_id': orderId,
      'order_uid': email,
      'notify_url': 'http://cn-sh-01-http.webpagemonitor.net/api/member/wxpaynotify',
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
      orderId,
      orderUid: email,
    })
    
  } catch (error) {
    res.status(500).json({err: error})
  }
}

export default middlewares.authJwt(genWxPayQrHandler);
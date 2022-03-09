// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDB, ObjectId, middlewares, NextApiRequestWithUserInfo } from '../../../lib';
import { CronTime } from '@webest/web-page-monitor-helper';
import { mongo, jwt } from '@webest/web-page-monitor-helper/node';

import { fetchAPI } from "../../../helpers/httpHooks"

async function checkWxMiniPayHandler(
  req: NextApiRequestWithUserInfo,
  res: NextApiResponse
){
  
  try {
    let db = await getDB();
  
    // find one payment from recent 1 hour
    // according to the comment / remark filled on user's one order
  
    let { emailOrComment } = req.body;
    if(!emailOrComment){
      emailOrComment = req.userInfo.email;
    }
    // get recent order array from wx
    // NOTICE:  we used json-bigint for JSON parse.
    let wxResp = await fetchAPI('/wx/product/order/get_list',{
      start_create_time: CronTime.toLocalString(new Date(), -60*24),
      end_create_time: CronTime.toLocalString(new Date(), 5),
      status: 20,
      page: 1,
      page_size: 200,
    });
  
    let matchedArr = [];
  
    // find matched order according to emailOrComment ( order's customer_notes )
    if(!wxResp.errcode && wxResp.orders.length){
      matchedArr = Array.from(wxResp.orders).filter((order: any)=>{
        let { ext_info = {} } = order;
        let { customer_notes = "" } = ext_info;
        if(String(customer_notes).includes(emailOrComment)){
          return true
        }else{
          return false;
        }
      })
    }
  
    if(!db){
      return res.status(500).json({ err: 'db lost' })
    }
  
    if(matchedArr && matchedArr.length){
      let totalPrice = 0;
      for (let order of matchedArr) {
        let order_id = String(order.order_id);
        let wxResp2 = await fetchAPI('/wx/product/delivery/send', {
          order_id,
          delivery_list: [{
            "": [
              
            ]
          }]
        });
        if(wxResp2 && wxResp2.errcode === 0){
          // update points
          // TODO reject aftersale refund
          let productPrice = Number(order.order_detail.price_info.product_price);
          if(Number.isNaN(productPrice)){
            return;
          }else{
            totalPrice += productPrice;
          }
          await db.collection('user').updateOne({email: emailOrComment}, {
            $inc: {
              points: productPrice ,  // 1 cent = 1 point
            },
          });
        }
      }
      console.log(`${emailOrComment} added ${totalPrice} points`);
      return res.json({
        email: emailOrComment,
        points: totalPrice, // 1 cent = 1 point
        success: true,
      });
    }else{
      res.json({err:'no matched order', success: false});
    }
  
    
  } catch (error) {
    res.status(500).json({err: error.message})
  }
}

export default middlewares.authJwt(checkWxMiniPayHandler);
import type { NextPage } from 'next'
import React, { useEffect, } from 'react';
import { useRouter } from 'next/router'
import { useImmerAtom } from 'jotai/immer';
import { userInfoAtom } from '../atoms';
import { io } from "socket.io-client";
import { frontCONFIG as CONFIG } from '../../CONFIG';
import { fetchAPI, verifyJwt } from '../helpers';
import { CronTime } from '@webest/web-page-monitor-helper';


/**
 * https://socket.io/docs/v4/client-initialization/
 */
const IOTestPage: NextPage = () => {
  const socket = io(CONFIG.socketio, { autoConnect: false });
  const [userInfo] = useImmerAtom(userInfoAtom);
  useEffect(() => {
    // client-side
    // https://socket.io/docs/v4/client-socket-instance/
    socket.auth = { userInfo: userInfo };
    if(userInfo.email && !socket.connected){
      connectSocketIO();
    }
    return ()=>{
      socket.disconnect();
    };

  }, [userInfo]);

  useEffect(()=>{
    async function test() {

      let resp0 = await fetchAPI('/member/checkWxMiniPay', {
        emailOrComment: "hnnk@qq.com"
      })
      console.log(resp0);

      return;
      // let info = await verifyJwt(userInfo.jwtToken + 'sd');
      // console.log(info);
      // let wxResp = await fetchAPI('/wx/product/order/get', {
      //   "order_id":'3201767440079389440' 
      // });
      // console.log(String(wxResp.order.order_id ));
      let wxResp2 = await fetchAPI('/wx/product/order/get_list', {
        "start_create_time": CronTime.toLocalString(new Date(), -60*24),
        "end_create_time": CronTime.toLocalString(new Date(), 5),
        status: 20,
        page: 1,
        page_size: 200,
      });
      let matchedArr = [];
      if(!wxResp2.errcode && wxResp2.orders.length){
        matchedArr = Array.from(wxResp2.orders).filter((order: any)=>{
          let { ext_info = {} } = order;
          let { customer_notes = "" } = ext_info;
          if(customer_notes === "lll@qq.com"){
            return true
          }else{
            return false;
          }
        })
      }
      console.log(wxResp2);
      if(matchedArr && matchedArr.length){
        matchedArr.forEach(async (order) =>{
          let order_id = String(order.order_id);
          let wxResp3 = await fetchAPI('/wx/product/delivery/send', {
            order_id,
            delivery_list: [{
              "": [

              ]
            }]
          });
          console.log(wxResp3);
        })
      }
    }

    test()
  },[]);

  async function connectSocketIO(){
    if(socket.connected) {
      return;
    }
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on("disconnect", () => {
      console.log(socket.id); // undefined
    });

    socket.on('room' + userInfo.email, (arg) => {
      console.log('frontend recieved data from server' , arg)
    })

    socket.connect();
  }

  const router = useRouter();
  return (
    <div>
      Welcome {userInfo.email} <br />
      {/* <button onClick={connectSocketIO}>socket.io Connect</button> */}
    </div>
  )

}

export default IOTestPage
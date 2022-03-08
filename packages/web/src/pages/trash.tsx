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
      // let info = await verifyJwt(userInfo.jwtToken + 'sd');
      // console.log(info);
      let wxResp = await fetchAPI('/wx/product/order/get', {
        "order_id":'3201767440079389440' 
      });
      console.log(String(wxResp.order.order_id ));
      // let wxResp2 = await fetchAPI('/wx/product/order/get_list', {
      //   "start_create_time": CronTime.toLocalString(new Date(), -60*24),
      //   "end_create_time": CronTime.toLocalString(new Date(), 5),
      //   status: 20,
      //   page: 1,
      //   page_size: 200,
      // });
      // console.log(wxResp2);
      // let wxResp2_5 = await fetchAPI('/wx/product/shipmethods/get', {
        
      // });
      // console.log(wxResp2_5);
      // let wxResp3 = await fetchAPI('/wx/product/delivery/send', {
        // order_id: '3201767440079389440',
        // delivery_list: [
        //   {
        //     delivery_id:"HSWL",
        //     waybill_id: Math.floor(Math.random() * 100000000000)
        //   },
        // ],
      // });
      // console.log(wxResp3);
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
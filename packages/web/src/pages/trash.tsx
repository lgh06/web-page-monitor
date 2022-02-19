import type { NextPage } from 'next'
import React, { useEffect, } from 'react';
import { useRouter } from 'next/router'
import { useImmerAtom } from 'jotai/immer';
import { userInfoAtom } from '../atoms';
import { io } from "socket.io-client";
import { CONFIG } from '../../CONFIG';
import { decodeProtectedHeader,decodeJwt, } from "jose";

import { KEYUTIL, jws } from "jsrsasign";

import { pub } from "@webest/web-page-monitor-helper";

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
      const decodedHeader = await decodeProtectedHeader(userInfo.jwtToken);
      const decodedJwt = await decodeJwt(userInfo.jwtToken);
      console.log(decodedHeader, decodedJwt)
      
      const pubKey = KEYUTIL.getKey(pub);

      const jwtVerifyResult = jws.JWS.verifyJWT(userInfo.jwtToken, pubKey, {alg: ['PS384']});
      console.log(jwtVerifyResult)
    }

    test()
  },[userInfo]);

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
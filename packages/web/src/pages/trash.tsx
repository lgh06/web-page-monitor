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

const jwt = `eyJhbGciOiJQUzM4NCJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZX0.tfXLqzNaid3JURMMZMkbCBk8h63VFwpPG6lRH4cnwuEQdYTUNKPuCRHIlbajrWjS03Lms0X-CWF7VFih32y6gyCiBQqXkxwOz0FLYZ9DIuu9-pRzAErOn2QwMLNGe7BEut4TURrj4mMz7Osh8QHBmHdIQoWDaOLY_oduykQlQvA3oDazWbjMg49lSlofS8HVjejUMIRPUnnS5q3XHV-s7LNTdpEcub96-5D4K2QguUasGBy9z5KvF91SQzkcGXtB0m89DZPuAg9rOEeUmG9hWFXGuB_nQaw5NiMMIuTHRr6lzoioOggBSjkeLeauURslHAPzDR3Lvo8Igj80Ik5mTQ`

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
      const decodedHeader = await decodeProtectedHeader(jwt);
      const decodedJwt = await decodeJwt(jwt);
      console.log(decodedHeader, decodedJwt)
      
      const pubKey = KEYUTIL.getKey(pub);

      const jwtVerifyResult = jws.JWS.verifyJWT(jwt, pubKey, {alg: ['PS384']});
      console.log(jwtVerifyResult)
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
import type { NextPage } from 'next'
import React, { useEffect, } from 'react';
import { useRouter } from 'next/router'
import { useImmerAtom } from 'jotai/immer';
import { userInfoAtom } from '../atoms';
import { io } from "socket.io-client";
import { CONFIG } from '../../CONFIG';
import { SignJWT,
  generateKeyPair, exportJWK,importJWK,
  decodeProtectedHeader,decodeJwt,
  jwtVerify,
} from "jose";

// import * as rsaSignUtil from "jsrsasign-util";
import * as rsaSign from "jsrsasign";

export const pub ={
  "kty": "RSA",
  "n": "4hgRBMq4u0VQS3ikP0EoWfNLKsHWNNKxNwYvKO98uffQiK9pOcdEYudo0yPHZZ0i56RkO24tdV80fldU3h0KEdXuxNb9yPlfWQ7NUY5OFQhh6GeqnEqPoA4VYDCTrznYij2sro34zhvvgVwtzoaBZ57fol9BO29KsXGn5HGFWIx7SIGhXGEpmho9ikXtSCJsm8Pvb75gPcwZfQjETg-kGljOKpsNA-IwM0P7_cBlsbmk-wGCwNG2nmvggOV1SlrAvzKbXfKzkIS8WJ0kOcyzL7woc2PpIw_A-DFgd7hIIe61NCH80mlZQQNp6aKluSDNBuA1b9jCP-Ql0rIq0oLapw",
  "e": "AQAB"
}

const jwt = `eyJhbGciOiJQUzM4NCJ9.eyJ1cm46ZXhhbXBsZTpjbGFpbSI6dHJ1ZX0.TdIWYvY1CpgYnQLrPukiJE_jVUmd0bUzI5NLk3W3FQSKv8BLFm9TMYxoumBUD26S0fzghUDhC5AFaKd-78PfBggvt0TE22GJLmXzXL3c1O2UG3sA6IBrS4QSzxiojNLrRxTGamoHpvY3IOl8eRRM1XTSvHXw85uPWtcBCDcGmB2myn1C7_MUmWQHNOo-1rZfuCo4CQFAYzdYp57xXWPJRZLU0Lza0deMG4LREmtibvU5xBplJqw5qfT6NoD_Cgh48F1OYgndYzKljWLw2Gk9sP2zxXxGSSIn5TFkGSy3Ao6SiP25ZWbs_isOq6VdpvfqkCCn_ygtxrAS7oB5JWJa0A`

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
      
      const pubKey = rsaSign.KEYUTIL.getKey(pub);

      const jwtVerifyResult = rsaSign.jws.JWS.verifyJWT(jwt, pubKey, {alg: ['PS384']});
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
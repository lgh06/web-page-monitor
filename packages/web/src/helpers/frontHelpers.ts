import { NextRouter } from "next/router";
import { MouseEventHandler } from "react";

import { decodeProtectedHeader,decodeJwt, } from "jose";
import { KEYUTIL, jws } from "jsrsasign";

import { pub } from "@webest/web-page-monitor-helper";

export function clickGoBack(router:NextRouter){
  return (e:MouseEvent)=> {
    e.preventDefault();
    router.back();
  }
}

const pubKey = KEYUTIL.getKey(pub);

// web browser frontend use
export async function verifyJwt(jwtToken){
  try {
    const decodedHeader = await decodeProtectedHeader(jwtToken);
    const decodedJwt = await decodeJwt(jwtToken);
  
    const jwtVerifyResult = jws.JWS.verifyJWT(jwtToken, pubKey, {alg: ['PS384']});
    return {
      verified: jwtVerifyResult,
      header: decodedHeader,
      jwt: decodedJwt,
    }
  } catch (error) {
    return {
      verified: false,
      header: null,
      jwt: null,
    }
  }
}
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

export function logOut({setUserInfo, router}){
  setUserInfo((v) => {
    v.email = undefined;
    v.emailState = '';
    v.logged = false;
    v.oauthProvider = '';
    v._id = '';
    v.code = '';
    v.jwtToken = '';
  });
  router.push('/login');
}

export function mergeToTarget(source, target, func?) {

  // https://stackoverflow.com/a/34624648/5332156
  // Prevent undefined objects
  // if (!aObject) return aObject;

  let value;
  if(typeof target === "undefined"){
    target = {};
  }
  for (const key in source) {

    // Prevent self-references to parent object
    // if (Object.is(source[key], source)) continue;
    
    value = source[key];

    if(func){
      target[key] = (value === null && !target[key] && target[key] !== '') ? null : (typeof value === "object" && !Array.isArray(value)) ? mergeToTarget(value, target[key], func) : func(value, target[key])
    }else{
      target[key] = (value === null && !target[key] && target[key] !== '') ? null : (typeof value === "object" && !Array.isArray(value)) ? mergeToTarget(value, target[key]) : value;
    }

  }
  return target;
}
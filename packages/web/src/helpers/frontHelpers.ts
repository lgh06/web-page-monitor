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
// verifyJwt
export async function verifyJwt(jwtToken){
  try {
    const decodedHeader = await decodeProtectedHeader(jwtToken);
    const decodedJwt = await decodeJwt(jwtToken);
  
    const jwtVerifyResult = jws.JWS.verifyJWT(jwtToken, pubKey, {alg: ['PS384']});
    return {
      verified: jwtVerifyResult,
      header: decodedHeader,
      payload: decodedJwt,
    }
  } catch (error) {
    return {
      verified: false,
      header: null,
      payload: null,
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
    v.nextAddPointsTime = 0;
    v.points = 0;
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

/** 
 * https://stackoverflow.com/a/68146412/5332156
 * Convert a 2D array into a CSV string
 */
export function arrayToCsv(array = []){
  let headers = Object.keys(array[0]).join(',') + '\r\n';
  let arrResult = array.map((row = {}) => {

    let inner = Object.values(row).map(cellValue => {
      if(typeof cellValue === 'object'){
        let stringified;
        try {
          stringified = JSON.stringify(cellValue);
        } catch (error) {
          stringified = '';
        }
        return stringified;
      }else if (String(cellValue).match(/\,|\"/)){
        /**
         * https://stackoverflow.com/questions/4617935/is-there-a-way-to-include-commas-in-csv-columns-without-breaking-the-formatting
         * https://www.cnblogs.com/xiaomiganfan/p/4073454.html
         * https://blog.csdn.net/ylq1045/article/details/115906779
         * esacpe comma and quote in csv cell value
         */
        return String(cellValue).split('"').map(v => `"${v}"`).join('').replaceAll(`,`, `"",""`)
      }else{
        return cellValue;
      }
    }).join(',')  // comma-separated
    console.log('inner', inner);
    return inner;
  }).join('\r\n');

  console.log(headers, arrResult);
  
  return "\ufeff" + headers + arrResult; // rows starting on new lines
}

/** Download contents as a file
 * Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
 */
 export function downloadBlob(content, filename, contentType) {
  // Create a blob
  var blob = new Blob([content], { type: contentType });
  var url = URL.createObjectURL(blob);

  // Create a link to download it
  var pom = document.createElement('a');
  pom.setAttribute('download', filename);
  pom.href = url;
  document.body.appendChild(pom);
  pom.click();
  setTimeout(()=>{
    URL.revokeObjectURL(pom.href);
    document.body.removeChild(pom);
  }, 5000);
}

export function getTaskExpireStatusAndColor(taskMeta){
  let endDate;
  let status = "";
  let color;
  let now = Date.now();
  if(taskMeta.endTime){
    endDate = new Date(taskMeta.endTime).valueOf();
  }
  if(now > endDate){
    status = 'Expired';
    color = 'red';
  }else if (now + 1000 * 3600 * 24 > endDate){
    status = 'Expiring soon';
    color = 'yellow';
  }else{
    status = 'Running';
    color = 'green';
  }
  return {status, color};
}
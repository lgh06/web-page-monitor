import { useState, useEffect } from 'react';
import { frontCONFIG as CONFIG } from '../../CONFIG';

export function useAPI(endPoint: string, postedObject: undefined | object = undefined, method?: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function http() {
      let resp = await fetch(`${CONFIG.apiHost}${CONFIG.apiPrefix}${endPoint}`, {
        method: (method ? String(method).toUpperCase() : null) || (postedObject ? 'POST' : 'GET'),
        headers: typeof postedObject === 'object' ? {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        } : {},
        redirect: 'follow',
        body: typeof postedObject === 'object' ? JSON.stringify(postedObject) : null
      });
      const res = await resp.json();
      setData(res);
      setLoading(false);
    }
    http();
  }, []);
  return { data, loading };
}

export async function fetchAPI(endPoint: string, postedObject: undefined | object = undefined, method?: string) {
  let headers = {};
  if(typeof postedObject === 'object' ){
    headers['Content-Type'] = 'application/json';
    // 'Content-Type': 'application/x-www-form-urlencoded',
  }
  if(typeof window !== 'undefined' && window.localStorage){
    let { userInfo } = window.localStorage;
    console.log('inside fetchAPI', userInfo);
    if(userInfo){
      let parsedUserInfo;
      try {
        // TODO save userInfo to another localStorage item
        parsedUserInfo = JSON.parse(userInfo);
        headers['Authorization'] = `Bearer ${parsedUserInfo.jwtToken}`;
      } catch (error) {
        console.log('localStorage userInfo parse error', error);
      }
    }
  }
  let resp = await fetch(`${CONFIG.apiHost}${CONFIG.apiPrefix}${endPoint}`, {
    method: (method ? String(method).toUpperCase() : null) || (postedObject ? 'POST' : 'GET'),
    headers: headers,
    redirect: 'follow',
    body: typeof postedObject === 'object' ? JSON.stringify(postedObject) : null
  });
  const res = await resp.json();
  return res;
}

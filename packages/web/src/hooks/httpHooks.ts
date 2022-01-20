import { useState, useEffect } from 'react';
import { CONFIG } from '../../CONFIG';

export function useReq(endPoint: string,postedObject: undefined | object = undefined){
  const [data, setData] = useState(null);
  useEffect(() => {
    async function http() {
      let resp = await fetch(`${CONFIG.backHost}${endPoint}`, {
        method: postedObject ? 'POST' : 'GET',
        body:  typeof postedObject === 'object' ? JSON.stringify(postedObject) : null
      });
      const res = await resp.json();
      setData(res)
    }
    http();
  },[]);
  return { data };
}
import { useState, useEffect } from 'react';
import { CONFIG } from '../../CONFIG';

export function useAPI(endPoint: string, postedObject: undefined | object = undefined, method?: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function http() {
      let resp = await fetch(`${CONFIG.backHost}/api${endPoint}`, {
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
  let resp = await fetch(`${CONFIG.backHost}/api${endPoint}`, {
    method: (method ? String(method).toUpperCase() : null) || (postedObject ? 'POST' : 'GET'),
    headers: typeof postedObject === 'object' ? {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    } : {},
    redirect: 'follow',
    body: typeof postedObject === 'object' ? JSON.stringify(postedObject) : null
  });
  const res = await resp.json();
  return res;
}

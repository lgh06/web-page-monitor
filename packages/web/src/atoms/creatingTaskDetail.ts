import { atom } from 'jotai'
import { useState, useEffect } from 'react';
import { CONFIG } from '../../CONFIG';


let creatingTaskDetail = {
  endLocalMinuteString: '',
  startLocalMinuteString: '',
  cronSyntax: '0 0 * * * *',
  cronMsg: 'Please Input a cron syntax:',
  cronPassed: true,
}

export function useReq(){
  useEffect(() => {
    async function http() {
      let resp = await fetch(`${CONFIG.backHost}/api/task/create_task`, {
        method: 'POST',
        body: new URLSearchParams(`client_secret=${CONFIG.giteeOauthClientSecret}`)
      });
      const data = await resp.text();
      console.log(data)
    }
    http();
  });
}


export const creatingTaskDetailAtom = atom(creatingTaskDetail);

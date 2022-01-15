import type { NextPage } from 'next'
import React, { useState, useEffect, } from 'react';
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring';
import CONFIG from '../../CONFIG';
import { useImmerAtom } from 'jotai/immer';
import { userInfoAtom } from '../atoms';


const LoginPage: NextPage = () => {
  let url = `https://gitee.com/oauth/authorize?client_id=${CONFIG.giteeOauthClientId}&redirect_uri=${encodeURIComponent(CONFIG.giteeRedirectUri)}&response_type=code`;
  
  const router = useRouter();
  const [userInfo, setUserInfo] = useImmerAtom(userInfoAtom);

  /**
   * get user info from gitee
   */
  useEffect(()=>{
    let { code, provider } = router.query;
  
    console.log(router.query)
    if(code && provider){
      getUserInfo(router.query);
    }
    async function getUserInfo(query:ParsedUrlQuery){
      let { code, provider } = query;
      if( provider === 'gitee' && code){
        // if we have code, then ask for access_token
        // https://gitee.com/api/v5/oauth_doc#/list-item-2
        let resp = await fetch(`https://gitee.com/oauth/token?grant_type=authorization_code&code=${code}&client_id=${CONFIG.giteeOauthClientId}&redirect_uri=${CONFIG.giteeRedirectUri}`, {
          method: 'POST',
          body: new URLSearchParams(`client_secret=${CONFIG.giteeOauthClientSecret}`)
        });
        const data = await resp.json();
        // got access_token
        const {access_token, refresh_token, scope } = data;
        if (String(scope).includes('email')){
          // ask for emails
          // https://gitee.com/api/v5/swagger#/getV5Emails
          let resp2 = await fetch(`https://gitee.com/api/v5/emails?access_token=${access_token}`, {
            method: 'GET',
          });
          const emails = await resp2.json();
          // emails, array, may have multiple emails
          console.log(emails)
          if(emails && emails.length && emails[0] && emails[0].email ){
            setUserInfo((v) => {
              v.email = emails[0].email;
              v.emailState = emails[0].state;
              v.logged = true;
            });
          }
        }
      }
    }

  }, [router.query]);

  /**
   * Events
   */
  function logOut(){
    setUserInfo((v) => {
      v.email = undefined;
      v.emailState = '';
      v.logged = false;
    });
    router.push('/login');
  }

  if( userInfo.logged ) {
    return (
      <div>Welcome, {userInfo.email} <br />
        <button onClick={logOut}>Log Out</button>
      </div>
    )
  } else {
    return (
      <a href={url}>Login</a>
    )
  }
}

export default LoginPage
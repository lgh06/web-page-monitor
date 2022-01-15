import type { NextPage } from 'next'
import React, { useState, useLayoutEffect, useEffect, MouseEventHandler } from 'react';
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring';
import CONFIG from '../../CONFIG';


const LoginPage: NextPage = () => {
  let url = `https://gitee.com/oauth/authorize?client_id=${CONFIG.giteeOauthClientId}&redirect_uri=${encodeURIComponent(CONFIG.giteeRedirectUri)}&response_type=code`;
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState({email: '',});
  const router = useRouter();

  /**
   * get user info from gitee
   */
  useLayoutEffect(()=>{
    let { code, provider } = router.query;
  
    console.log(router.query)
    if(code && provider){
      setLogged(true);
      getEmail(router.query);
    }
    async function getEmail(query:ParsedUrlQuery){
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
            setUser({
              email: emails[0].email
            })
          }
        }
      }
    }

  }, [router.query]);


  /**
   * Events
   */
  function logOut(){
    setLogged(false);
    setUser({email:''});
    router.push('/login');
  }

  if( logged ) {
    return (
      <div>Welcome, {user.email} <br />
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
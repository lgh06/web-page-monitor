import type { NextPage } from 'next'
import React, { useEffect, } from 'react';
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring';
import CONFIG from '../../CONFIG';
import { useImmerAtom } from 'jotai/immer';
import { userInfoAtom } from '../atoms';
import { useAPI, fetchAPI } from '../helpers';
import Link from 'next/link';


const LoginPage: NextPage = () => {
  let url = `https://gitee.com/oauth/authorize?client_id=${CONFIG.giteeOauthClientId}&redirect_uri=${encodeURIComponent(CONFIG.giteeRedirectUri)}&response_type=code`;

  const router = useRouter();
  const [userInfo, setUserInfo] = useImmerAtom(userInfoAtom);

  /**
   * get user info from gitee
   */
  useEffect(() => {
    let { code, provider } = router.query;

    console.log(router.query)
    if (code && provider) {
      getUserInfo(router.query);
    }
    async function getUserInfo(query: ParsedUrlQuery) {
      let { code, provider } = query;
      if (provider === 'gitee' && code) {
        // if we have code, then ask for access_token
        // https://gitee.com/api/v5/oauth_doc#/list-item-2
        let resp = await fetch(`https://gitee.com/oauth/token?grant_type=authorization_code&code=${code}&client_id=${CONFIG.giteeOauthClientId}&redirect_uri=${CONFIG.giteeRedirectUri}`, {
          method: 'POST',
          body: new URLSearchParams(`client_secret=${CONFIG.giteeOauthClientSecret}`)
        });
        const data = await resp.json();
        // got access_token
        const { access_token, refresh_token, scope } = data;
        if (String(scope).includes('email')) {
          // ask for emails
          // https://gitee.com/api/v5/swagger#/getV5Emails
          let resp2 = await fetch(`https://gitee.com/api/v5/emails?access_token=${access_token}`, {
            method: 'GET',
          });
          const emailResp = await resp2.json();
          // emailResp, array, may have multiple emailResp
          console.log(emailResp)
          if (emailResp && emailResp.length && emailResp[0] && emailResp[0].email) {
            router.replace("/login")
            // TODO error catch and hint
            let {value: {_id}} = await fetchAPI('/user/save',{
              email: emailResp[0].email, 
              oauthProvider: provider,
              emailVerified: emailResp[0].state === 'confirmed'
            })
            setUserInfo((v) => {
              v.email = emailResp[0].email;
              v.emailState = emailResp[0].state;
              v.logged = true;
              v._id= _id;
            });
          }
        }
      }
    }

  }, [router.query]);

  /**
   * Events
   */
  function logOut() {
    setUserInfo((v) => {
      v.email = undefined;
      v.emailState = '';
      v.logged = false;
    });
    router.push('/login');
  }

  const linkStyle = {
    textDecoration: "underline"
  }

  if (userInfo.logged) {
    return (<>
      <div>Welcome, {userInfo.email} <br />
        <button onClick={logOut}>Log Out</button>
      </div>
      <div>
        <Link href='./create_task'><a style={linkStyle}>Please create a task</a></Link>
      </div>
    </>
    )
  } else {
    return (
      <a href={url}>Login</a>
    )
  }
}

export default LoginPage
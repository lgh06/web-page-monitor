import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring';
import { frontCONFIG as CONFIG } from '../../CONFIG';
import { useImmerAtom } from 'jotai/immer';
import { userInfoAtom } from '../atoms';
import { useAPI, useI18n, fetchAPI, genClassNameAndString, logOut } from '../helpers';
import Link from 'next/link';
import styles from '../styles/modules/login.module.scss';


const Back = () => {
  let { t } = useI18n();
  return (<div>
        <Link href="/"><a {...cn('link')}>{t(`Go Back to home`)}</a></Link>
    </div>)
}

let [cn, cs] = genClassNameAndString(styles);
const LoginPage: NextPage = () => {
  let { t } = useI18n();
  let genUrl = (giteeRedirectUri: string) => {
    return `https://gitee.com/oauth/authorize?client_id=${CONFIG.giteeOauthClientId}&redirect_uri=${encodeURIComponent(giteeRedirectUri)}&response_type=code`;
  }
  
  const router = useRouter();
  const [userInfo, setUserInfo] = useImmerAtom(userInfoAtom);
  
  const [giteeRedirectUri, setGiteeRedirectUri] = useState('');
  const [url, setUrl] = useState('');

  /**
   * get user info from gitee
   */
  useEffect(() => {
    let { code, provider } = router.query;
    let { locale } = router;
    if(typeof window !== 'undefined'){
      let { origin } = window.location;
      let fullUri = `${origin}${router.basePath}?provider=gitee`;
      setGiteeRedirectUri(encodeURIComponent(fullUri))
      setUrl(genUrl(fullUri));
      console.log('inside useEffect login.tsx', url, giteeRedirectUri, code, provider, locale);
    }
    if (code && provider && url && giteeRedirectUri) {
      getUserInfo(router.query);
    }
    async function getUserInfo(query: ParsedUrlQuery) {
      let { code, provider } = query;
      if (provider === 'gitee' && code) {
        // if we have code, then ask for access_token
        // https://gitee.com/api/v5/oauth_doc#/list-item-2
        let resp = await fetch(`https://gitee.com/oauth/token?grant_type=authorization_code&code=${code}&client_id=${CONFIG.giteeOauthClientId}&redirect_uri=${giteeRedirectUri}`, {
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
          if (emailResp && emailResp.length && emailResp[0] && emailResp[0].email) {
            router.replace("/login")
            // TODO error catch and hint
            let { value: { _id }, jwtToken } = await fetchAPI('/user/save', {
              email: emailResp[0].email,
              oauthProvider: provider,
              emailVerified: emailResp[0].state === 'confirmed'
            })
            setUserInfo((v) => {
              v.email = emailResp[0].email;
              v.emailState = emailResp[0].state;
              v.logged = true;
              v.oauthProvider = String(provider);
              v._id = _id;
              v.jwtToken = jwtToken;
            });
          }
        }
      }
    }

  }, [router, url, giteeRedirectUri]);


  const linkStyle = {
    textDecoration: "underline"
  }

  let res;
  let backLink = <><div><Link href="/"><a {...cn('link')}>{t(`Go Back to home`)}</a></Link></div></>;

  if (userInfo.logged) {
    res = (<main>
      <div>{t(`Welcome`)}, {userInfo.email} <br />
        <button onClick={() => logOut({setUserInfo, router})}>{t(`Log Out`)}</button>
      </div>
      <div>
        <Link href='/create_task_simp'><a {...cn('link')}> {t(`Create a task in Simple Mode`)} ({t(`Recommended`)})</a></Link>
      </div>
      {/* <div>
        <Link href='/create_task_geek'><a {...cn('link')}>create a task in Geek Mode (Code Mode)</a></Link>
      </div> */}
      {/* <div>
        <Link href='/faq#WhatIsSimpleMode'><a {...cn('link')}>see FAQ for Simple Mode / Geek Mode helps </a></Link>
      </div> */}
      <Back/>
    </main>
    )
  } else {
    res = (<main>
        <a {...cn('link')} href={url}>{t(`Login with Gitee.com OAuth`)}</a>
        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
        <div>// TODO other OAuth login providers</div>
        <Back/>
      </main>
    )
  }
  return res;
}

export default LoginPage
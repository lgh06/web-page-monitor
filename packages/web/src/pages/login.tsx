// @ts-nocheck
import type { NextPage } from 'next'
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring';
import { CONFIG } from '../../CONFIG';
import { useImmerAtom } from 'jotai/immer';
import { userInfoAtom } from '../atoms';
import { useAPI, useI18n, fetchAPI, genClassNameAndString, logOut, useHeadTitle } from '../helpers';
import Link from 'next/link';
import styles from '../styles/modules/login.module.scss';

const Back = () => {
  let { t } = useI18n();
  return (<div style={{
    marginTop: '.3rem',
  }}>
        <Link prefetch={false} href="/"><a {...cn('link')}>{t(`Go Back to home`)}</a></Link>
    </div>)
}

let [cn, cs] = genClassNameAndString(styles);
const LoginPage: NextPage = () => {
  let { t, locale } = useI18n();
  let genUrl = (giteeRedirectUri: string) => {
    return `https://gitee.com/oauth/authorize?client_id=${CONFIG.giteeOauthClientId}&redirect_uri=${encodeURIComponent(giteeRedirectUri)}&response_type=code`;
  }
  
  const router = useRouter();
  const [userInfo, setUserInfo] = useImmerAtom(userInfoAtom);
  
  const [giteeRedirectUri, setGiteeRedirectUri] = useState('');
  const [showFirebaseLogin, setShowFirebaseLogin] = useState(false);
  const [url, setUrl] = useState('');

  let headTitle = useHeadTitle(userInfo.logged ? 'User Center' : 'Login');
  /**
   * get user info from gitee
   */
  useEffect(() => {
    let { code, provider } = router.query;
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
        try {
          let resp = await fetchAPI('/user/oauth',{
            code,
            redirectUri: giteeRedirectUri,
            provider
          });
          router.replace("/login")
          if(resp.err){
            alert(t(resp.err));
            return;
          }
          // TODO error catch and hint
          let { value: { _id, email, emailState, oauthProvider }, jwtToken } = resp;
          setUserInfo((v) => {
            v.email = email;
            v.emailState = emailState;
            v.logged = true;
            v.oauthProvider = oauthProvider;
            v._id = _id;
            v.jwtToken = jwtToken;
          });
        } catch (error) {
          alert(error)
        }
      }
    }

  }, [router, url, giteeRedirectUri]);

  useEffect(() =>{
    // show firebase login or not
    (function(){var image = new Image();var isS;
      image.onload = function () {
        isS=true;
        setShowFirebaseLogin(true);
      };
      image.onerror=function(){
        isS=false;
        setShowFirebaseLogin(false);
      };
      image.src = "https://www.google.com/favicon.ico" + `?t=${Date.now()}`;
      setTimeout(function(){if(isS === undefined)image.src=''},3000);
      })();

  },[]);

  let fetchUserPoints = async () =>{
    let resp = await fetchAPI(`/user/info?id=${userInfo._id}`)
    if(resp.length && resp[0].points && resp[0].nextAddPointsTime){
      setUserInfo((v)=>{
        v.points = resp[0].points;
        v.nextAddPointsTime = resp[0].nextAddPointsTime;
      })
    }
  }

  useEffect(()=>{
    if(userInfo.logged){
      fetchUserPoints()
    }
  },[userInfo.logged]);

  let res;
  let backLink = <><div><Link prefetch={false} href="/"><a {...cn('link')}>{t(`Go Back to home`)}</a></Link></div></>;

  if (userInfo.logged) {
    res = (<main>
      {headTitle}
      <Back/><br />
      <div>
        {t(`Welcome`)}, {userInfo.email} 
      </div>
      <div style={{zoom: 1.1}}>
        <Link href='/task/edit_simp'><a> {t(`Create task`)} ({t(`Recommended`)})</a></Link>
      </div>
      <div style={{zoom: 1.1}}>
        <Link prefetch={false} href='/task/list'><a> {t(`Task List`)}</a></Link>
      </div><br/>
      <div>
        <Link href='/task/edit_custom'><a {...cn('link')}> {t(`Create a task in Custom Mode`)}</a></Link>
      </div><br/>
      <div>
        {t(`Points`)}: {userInfo.points}
        &nbsp;
        <Link prefetch={false} href="/member/redeem">
          <a>{t(`Top up`)}</a>
        </Link>
      </div>
      <div>
        {t(`Every time one cron task's check will consume 1 point.`)}
        {/* {t(`Points consumed for different tasks may vary, in the future.`)} */}
      </div><br/>
      <custom-hint-two class={cs('smFont')}>
        <div>
          {t(`Next Add Points Time`)}: {new Date(userInfo.nextAddPointsTime).toLocaleString()}
        </div>
        <div>
          {t(`If your points below 80, then it will be reset to 80 on `)} {t(`Next Add Points Time`)}
        </div><br/>
        {
          locale === 'en' && (<div>
            You can find more details of free quota, price and limits at  &nbsp;
            <Link prefetch={false} href="https://docs.webpagemonitor.net/FAQ/free_quota_and_price/">
              <a target="_blank" rel="noopener noreferrer">here</a>
            </Link><br/><br/>
          </div>)
        }
        {
          locale === 'zh' && (<div>
            关于免费点数、价格与使用限制， 参见：&nbsp;
            <Link prefetch={false} href="https://a-1251786267.file.myqcloud.com/webpagemonitor_doc_site/zh/FAQ/free_quota_and_price/">
              <a target="_blank" rel="noopener noreferrer">这里</a>
            </Link><br/><br/>
          </div>)
        }
      </custom-hint-two>
      {/* <div>
        <Link href='/create_task_geek'><a {...cn('link')}>create a task in Geek Mode (Code Mode)</a></Link>
      </div> */}
      {/* <div>
        <Link href='/faq#WhatIsSimpleMode'><a {...cn('link')}>see FAQ for Simple Mode / Geek Mode helps </a></Link>
      </div> */}
      <div>
        <button onClick={() => logOut({setUserInfo, router})}>{t(`Log Out`)}</button>
      </div>
    </main>
    )
  } else {
    res = (<main>
        {headTitle}
        <div>
          <a {...cn('link')} href={url} rel="nofollow noreferrer noopener">{t(`Login with Gitee.com OAuth`)}</a>
        </div> <br />
        {
          showFirebaseLogin &&
          <div>
            <Link prefetch={false} href="/login_firebase?provider=google">
              <a {...cn('link')}>{t(`Login with Google (through Firebase)`)}</a>
            </Link>
          </div>
        }
        {
          showFirebaseLogin &&
          <div>
            <Link prefetch={false} href="/login_firebase?provider=github">
              <a {...cn('link')}>{t(`Login with Github (through Firebase)`)}</a>
            </Link>
          </div>
        }
        <br/>
        <custom-hint class={cs('smFont')}> 
        {t('By click above login links, you agree to our')}&nbsp;
          <a href={t(`https://docs.webpagemonitor.net/others/TOS/#TermsOfService`)} target="_blank" rel='noopener noreferrer'>{t('Terms of Service')}</a>
          &nbsp;{t('and')}&nbsp;
          <a href={t(`https://docs.webpagemonitor.net/others/PP/#PrivacyPolicy`)} target="_blank" rel='noopener noreferrer'>{t('Privacy Policy')}</a>
        </custom-hint>
        <br/>
        {
          locale === 'en' && (<custom-hint class={cs('smFont')}>
            Cannot login? See our docs &nbsp;
            <a href="https://docs.webpagemonitor.net/FAQ/reg_n_login/" target="_blank" rel="noopener noreferrer">here</a><br/><br/>
          </custom-hint>)
        }
        {
          locale === 'zh' && (<custom-hint class={cs('smFont')}>
            无法登录？ 查看 &nbsp;
            <a href="https://a-1251786267.file.myqcloud.com/webpagemonitor_doc_site/zh/FAQ/reg_n_login/" target="_blank" rel="noopener noreferrer">帮助文档</a><br/><br/>
          </custom-hint>)
        }<br/><br/>
        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
        {/* <div>// TODO other OAuth login providers</div> */}
        <Back/>
      </main>
    )
  }
  return res;
}

export default LoginPage
import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/modules/Home.module.scss'
import Link from 'next/link'
import { useI18n, verifyJwt, logOut } from '../helpers'
import Cookies from 'js-cookie'
import nextConfig from "../../next.config"
import { userInfoAtom } from '../atoms';
import { useImmerAtom } from 'jotai/immer'
import { useEffect, useState } from 'react'
import { NavHeader } from "./navHeader";


function Footer() {
  let { t, locale, router, hostName } = useI18n();
  let [userInfo,setUserInfo] = useImmerAtom(userInfoAtom);
  let switchLanguage = (lang: string) => {
    Cookies.set('NEXT_LOCALE', lang, { expires: 365 });
  }

  useEffect(() => {
    let { jwtToken } = userInfo;
    // console.log(jwtToken)
    if(jwtToken){
      verifyJwt(jwtToken).then(result =>{
        if(!result.verified){
          alert(t('Your session has expired, please login again.'));
          logOut({setUserInfo, router});
        }else{
          setUserInfo(v => {
            v._id = String(result.jwt._id);
            v.email = String(result.jwt.email);
            // console.log(userInfo)
          })
        }
      });
    }else{ // jwtToken is null or empty
      if( ! ['/login', '/faq', '/', ''].includes(router.pathname) ){
        alert(t('You need to login first.'));
        logOut({setUserInfo, router});
        router.push('/login');
      }
    }
  }, [userInfo.jwtToken, router]);
  
  let beianURL = "https://beian.miit.gov.cn/";
  let github = "https://github.com/lgh06/web-page-monitor";
  let [copyRightURL, setCopyRightURL] = useState(t(github));
  let [copyRightText, setCopyRightText]= useState(t('Daniel Gehuan Liu'));
  
  useEffect(()=>{
    if(hostName && hostName.match('passby.me') && locale === 'zh'){
      setCopyRightURL(beianURL);
      setCopyRightText('津ICP备14006885号-1');
    }else if(hostName && hostName.match('yanqiankeji.com') && locale === 'zh'){
      setCopyRightURL(beianURL);
      setCopyRightText('豫ICP备20008770号-1');
    }else if(hostName && hostName === 'other'){
    }else{
      setCopyRightURL(t(github));
      setCopyRightText(t('Created by') + ' ' + t('Daniel Gehuan Liu'));
    }
    // console.log('inside getCopyright',copyRightURL, copyRightText, hostName)
  }, [locale, hostName])

  return (
    <>
      <footer className={styles.footer}>
        <a href={copyRightURL} target="_blank" rel="noopener noreferrer">
          <span>{copyRightText}</span>
        </a>
        {/**
         * Next.js default language is en, prefix is / , zh is /zh
         * 
         * when static export, any language no prefix, just do a js language switch
         * 
         * static export default language is en
         */}
        <Link 
          href={'/zh'} 
          locale={false}>
          <a onClick={() => switchLanguage('zh')}>简体中文</a>
        </Link>
        <Link 
          href={'/'}
          locale={false}>
          <a onClick={() => switchLanguage('en')}>English</a>
        </Link>
      </footer>
    </>
  )
}

export default function Layout({ children }) {
  return (
    <>
      <NavHeader />
      {children}
      <Footer />
    </>
  )
}
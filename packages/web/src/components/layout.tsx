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
import Script from 'next/script'


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
            v._id = String(result.payload._id);
            v.email = String(result.payload.email);
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
        <a href={copyRightURL} target="_blank" rel="noopener noreferrer nofollow">
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

export default function Layout({ children, statusCode }) {
  let { t } = useI18n();
  if(statusCode){
    return (
      <>
        {children}
      </>
    )
  }
  return (
    <>
      <Head>
        <title>{t(`Web Site Page Changes Monitor`)}</title>
        <meta name="description" content={t(`Web Site Page Changes Monitor,Cloud watch web updates,with custom scripts`)} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="msvalidate.01" content="F18D53D95B52E2C08B800882D9946CA0" />
      </Head>
      <NavHeader />
      {children}
      <Footer />
      <Script defer id="bd1"
        src='https://hm.baidu.com/hm.js?155feb4af4ff86279f1fb8e01eebc1e6'
        strategy="afterInteractive"/>
      <Script defer id="gtag1"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PTKMFSF');`,
        }}/>
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PTKMFSF" height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
    </>
  )
}
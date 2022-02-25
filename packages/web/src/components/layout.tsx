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
import { useEffect } from 'react'


function Footer() {
  let { t, locale, router, hostName } = useI18n();
  let [userInfo,setUserInfo] = useImmerAtom(userInfoAtom);
  let switchLanguage = (lang: string) => {
    Cookies.set('NEXT_LOCALE', lang, { expires: 365 });
  }

  useEffect(() => {
    let { jwtToken } = userInfo;
    console.log(jwtToken)
    if(jwtToken){
      verifyJwt(jwtToken).then(result =>{
        if(!result.verified){
          alert(t('Your session has expired, please login again.'));
          logOut({setUserInfo, router});
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

  let copyRightURL="";
  let copyRightHTML = <></>;
  console.log('hostName',hostName)
  let getCopyright = () => {
    if(hostName && hostName.match('passby.me')){
      copyRightURL="https://beian.miit.gov.cn/";
      copyRightHTML = <>
        <span>津ICP备14006885号-1</span>
      </>
    }else if(hostName && hostName.match('yanqiankeji.com')){
      copyRightURL="https://beian.miit.gov.cn/";
      copyRightHTML = <>
        <span>豫ICP备20008770号-1</span>
      </>;
    }else if(hostName && hostName === 'other'){
    }else{
      copyRightURL = 
        locale === 'en' ? 
          "https://github.com/lgh06/web-page-monitor" : 
          "https://lgh06.coding.net/public/web-page-monitor/web-page-monitor/git";
      copyRightHTML = <>
        {t('Created by')}{' '}
        <span className={styles.logo}>
          {t('Daniel Gehuan Liu')}
          {/* <img src="/vercel.svg" alt="Vercel Logo" width={72} height={16} ></img> */}
        </span>
      </>
    }

    return {copyRightURL, copyRightHTML};
  }

  

  return (
    <>
      <footer className={styles.footer}>
        <a
          href={getCopyright().copyRightURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {
            getCopyright().copyRightHTML
          }
        </a>
        <Link href={process.env.NEXT_PUBLIC_export_lang ? '/' : '/zh'} locale={false}>
          <a onClick={() => switchLanguage('zh')}>简体中文</a>
        </Link>
        <Link href={'/'} locale={false}>
          <a onClick={() => switchLanguage('en')}>English</a>
        </Link>
      </footer>
    </>
  )
}

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
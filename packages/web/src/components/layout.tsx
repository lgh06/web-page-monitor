import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/modules/Home.module.scss'
import Link from 'next/link'
import { useI18n } from '../helpers'
import Cookies from 'js-cookie'
import nextConfig from "../../next.config"

function Footer() {
  let { t, locale } = useI18n();
  let switchLanguage = (lang: string) => {
    Cookies.set('NEXT_LOCALE', lang, { expires: 365 });
  }
  return (
    <>
      <footer className={styles.footer}>
        <a
          href={locale === 'en' ? 
            "https://github.com/lgh06/web-page-monitor" : 
            "https://lgh06.coding.net/public/web-page-monitor/web-page-monitor/git"}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('Created by')}{' '}
          <span className={styles.logo}>
            {t('Daniel Gehuan Liu')}
            {/* <img src="/vercel.svg" alt="Vercel Logo" width={72} height={16} ></img> */}
          </span>
        </a>
        <Link href={nextConfig.i18n!.defaultLocale === 'zh' ? '/' : '/zh' } locale={false}>
          <a onClick={() => switchLanguage('zh')}>简体中文</a>
        </Link>
        <Link href={nextConfig.i18n!.defaultLocale === 'en' ? '/' : '/en' } locale={false}>
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
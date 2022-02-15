import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/modules/Home.module.scss'
import Link from 'next/link'
import { useI18n } from '../helpers'
import Cookies from 'js-cookie'
import nextConfig from "../../next.config"

const Home: NextPage = () => {
  let { t, locale } = useI18n();
  let switchLanguage = (lang: string) => {
    Cookies.set('NEXT_LOCALE', lang, { expires: 365 });
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>{t(`Web Page Monitor`)}</title>
        <meta name="description" content={t(`Welcome to Web Page Monitor`)} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {t('Welcome to Web Page Monitor')}!!<br/>
          {t('Please')} <Link href="/login"><a>{t('Login')}</a></Link>
        </h1>

        {/* <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p> */}

        <div className={styles.grid}>
          <Link href="/faq">
            <a className={styles.card}>
              <h2>FAQ & Guide &rarr;</h2>
              <p>Frequently Asked Questions and Beginner Guide</p>
            </a>
          </Link>


          <Link href="/faq">
            <a className={styles.card}>
              <h2>新手入门 &rarr;</h2>
              <p>常见问题及新手入门</p>
            </a>
          </Link>

          {/* <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a> */}
        </div>
      </main>

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
    </div>
  )
}

export default Home

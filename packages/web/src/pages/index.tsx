import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/modules/Home.module.scss'
import Link from 'next/link'
import { innerHTML, useHeadTitle, useI18n } from '../helpers'
import { useEffect } from 'react'
import { userInfoAtom } from '../atoms'
import { useImmerAtom } from 'jotai/immer'

const Home: NextPage = () => {
  let { t, router } = useI18n();
  const [userInfo, setUserInfo] = useImmerAtom(userInfoAtom);
  useEffect(() =>{
    if(router.query && router.query.code){
      let queryString = "?";
      Object.keys(router.query).forEach(v => (queryString += `${v}=${router.query[v]}&`));
      queryString = queryString.substring(0, queryString.length - 1);
      router.push('/login' + queryString);
    }
  }, [router.query])

  let headTitle = useHeadTitle('Home Page');
  return (
    <div>
      <Head>
        {/* <title>{t(`Web Page Monitor`)}</title>
        <meta name="description" content={t(`Welcome to Web Page Monitor`)} />
        <link rel="icon" href="/favicon.ico" /> */}
        <meta name="msvalidate.01" content="F18D53D95B52E2C08B800882D9946CA0" />
      </Head>
      {headTitle}

      <main className={styles.main}>
        <h1 className={styles.title}>
          { userInfo.email ? (<>
            {t(`Welcome`)}, {userInfo.email} <br/>
            <Link href="/login"><a>{t('Go to User Center')}</a></Link>
          </>):(<>
            <span {...innerHTML(t('Welcome to Web Page Monitor'))}></span> <span style={{zoom: .45}}>alpha</span> <br/>
            {t('Please')} <Link href="/login"><a>{t('Login')}</a></Link>
            </>)}
        </h1>

        {/* <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p> */}

        <div className={styles.grid}>
          <Link prefetch={false} href="/faq" locale="en">
            <a className={styles.card}>
              <h2>FAQ & Guide &rarr;</h2>
              <p>Frequently Asked Questions and Beginner Guide</p>
            </a>
          </Link>


          <Link prefetch={false} href="/faq" locale="zh">
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

    </div>
  )
}

export default Home

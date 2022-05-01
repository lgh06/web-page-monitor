import type { NextPage } from 'next'
import Head from 'next/head'
// import Image from 'next/image'
import styles from '../styles/modules/Home.module.scss'
import Link from 'next/link'
import { innerHTML, useHeadTitle, useI18n } from '../helpers'
import { useEffect, useRef } from 'react'
import { userInfoAtom } from '../atoms'
import { useImmerAtom } from 'jotai/immer'

const Home: NextPage = () => {
  let { t, router, locale } = useI18n();
  const [userInfo, setUserInfo] = useImmerAtom(userInfoAtom);
  const videoElement = useRef<HTMLVideoElement>(null);
  useEffect(() =>{
    if(router.query && router.query.code){
      let queryString = "?";
      Object.keys(router.query).forEach(v => (queryString += `${v}=${router.query[v]}&`));
      queryString = queryString.substring(0, queryString.length - 1);
      router.replace('/login' + queryString);
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
            <span className='look-here'><Link href="/login"><a>{t('Go to User Center')}</a></Link></span>
          </>):(<>
            <span {...innerHTML(t('Welcome to Web Page Monitor'))}></span> <span style={{zoom: .45}}>alpha</span> <br/>
            {t('Please')} <span className='look-here'><Link href="/login"><a >{t('Login')}</a></Link></span>
            </>)}
        </h1>

        {/* <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p> */}

        <div className={styles.introText}>
        {
          locale === 'zh' && <>
              <h3>云端检测网页指定区域的文字变化, 发送Email通知</h3>
              <h3>公开网页，均可检测，免插件免挂机</h3>
              <h3>每月免费80次检测. 公开源码, 支持自己部署</h3>
              <h3>基于Next.js, MongoDB, RabbitMQ, puppeteer，高负载可扩展</h3>
            </>
        }
        {
          locale === 'en' && <>
              <h3>Monitor web page area&apos;s text changes, on cloud, then send Email alert.</h3>
              <h3>Public pages all detectable, no extensions, no always open PC</h3>
              <h3>Free 80 checks per month, open-source, self-host</h3>
              <h3>Based on Next.js, MongoDB, RabbitMQ, Puppeteer, scalable</h3>
            </>
        }
        </div>
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
        <div className={styles.video}>
        {
          locale === 'zh' && !userInfo.email &&
              <video 
                playsInline
                preload="meta"
                controls
                ref={videoElement}
                poster="images/poster-intro-cn-v2.jpg"
                src="https://alyjbedhbo.cdn.bspapp.com/ALYJBEDHBO-1f8d8dcb-ff67-4778-8209-da5ceecdd68f/9a6ee97a-49ce-4bbb-9d09-35caaa22df87.mp4"
                onError={(e) =>{
                  if(videoElement.current.src === '') return;
                  let srcArr = [
                    'https://alyjbedhbo.cdn.bspapp.com/ALYJBEDHBO-1f8d8dcb-ff67-4778-8209-da5ceecdd68f/9a6ee97a-49ce-4bbb-9d09-35caaa22df87.mp4',
                    'https://cdn.jsdelivr.net/gh/lgh06/web-page-monitor-assets@main/web-intro-video/intro-cn-20220331-v2.bin',
                    'https://assets.webpagemonitor.net/web-intro-video/intro-cn-20220331-v2.mp4',
                    'https://wpmt.cdn.bcebos.com/webpagemonitor-web/intro-video/intro-cn-20220331-v2.mp4',
                  ]
                  let alreadyMatched = false;
                  srcArr.forEach((v,i) =>{
                    if(alreadyMatched) return;
                    if(i === srcArr.length - 1){
                      // no more src url
                      return;
                    }
                    if( String(videoElement.current.src).includes(new URL(v).hostname) ){
                      alreadyMatched = true;
                      videoElement.current.src = srcArr[i+1];
                    }
                  });
                }}
              ></video>
        }
        {
          locale === 'en' && !userInfo.email &&
          <video 
            playsInline
            preload="meta"
            controls
            ref={videoElement}
            poster="images/poster-intro-en-v2.jpg"
            src="https://cdn.jsdelivr.net/gh/lgh06/web-page-monitor-assets@main/web-intro-video/intro-en-20220331-v2.bin"
            onError={(e) =>{
              if(videoElement.current.src === '') return;
              let srcArr = [
                'https://cdn.jsdelivr.net/gh/lgh06/web-page-monitor-assets@main/web-intro-video/intro-en-20220331-v2.bin',
                'https://assets.webpagemonitor.net/web-intro-video/intro-en-20220331-v2.mp4',
                'https://mellifluous-rabanadas-640a15.netlify.app/assets/intro-en-20220331-v2.mp4',
                'https://lgh06.github.io/web-page-monitor-assets/web-intro-video/intro-en-20220331-v2.mp4',
                'https://wpmt.cdn.bcebos.com/webpagemonitor-web/intro-video/intro-en-20220331-v2.mp4',
              ]
              let alreadyMatched = false;
              srcArr.forEach((v,i) =>{
                if(alreadyMatched) return;
                if(i === srcArr.length - 1){
                  // no more src url
                  return;
                }
                if( String(videoElement.current.src).includes(new URL(v).hostname) ){
                  alreadyMatched = true;
                  videoElement.current.src = srcArr[i+1];
                }
              });
            }}
        ></video>
        }
        </div>
      </main>

    </div>
  )
}

export default Home

import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { useEffect, useLayoutEffect, useState } from "react";
import { clickGoBack, genClassNameAndString, useHeadTitle, useI18n } from "../helpers";
import styles from "../styles/modules/faq.module.scss";

let [cn] = genClassNameAndString(styles);

const FaqPage: NextPage = () => {
  let router = useRouter();
  let { locale, t } = useI18n();
  let [highlight, setHighlight] = useState('');
  let [hash, setHash] = useState('');
  let headTitle = useHeadTitle('FAQ');
  useLayoutEffect(() => {
    if(window?.location.hash){
      setHash(String(window.location.hash));
      setHighlight('highlight');
    }else{
      setHighlight('')
    }
  })
  return (< main {...cn('faq-page')}>
    <style>{`
      .highlight ${hash}{
        background-color: lightpink;
      }
    `}</style>
    {headTitle}
    <div className={highlight}>
      {
        locale === 'en' ? <>
        <h1>FAQ</h1>
        <h2 id="WhatCanThisSiteDo"> What Can This Site Do?</h2>
        <p>Watch / Monitor a web page&apos;s changes, send you a email alert, or phone call alert (Work in Progress).
          <br/> See also <Link prefetch={false} href="/about"><a>About</a></Link> page.
        </p>
        <h2> Why should I choose your service, not choose A,B,C...?</h2>
        <p>Open Source, affordable, and we use modern techniques like Headless Chromium, 
          so you can monitor any URL you want, on the cloud, or on your local computer.
          <br/> See also <Link prefetch={false} href="/about"><a>About</a></Link> page.
        </p>
        <h2 id="WhatIsACronSyntaxCronPattern"> What Is A Cron Syntax / Cron Pattern ?</h2>
        <p {...cn('no-select')}>
          Cron Pattern example： <code>0 20 9,18 * * *</code> (contains: number, comma, *, space) <br />
          From left to right: seconds, minutes, hours, days, months and weeks, so the meaning is: execute every day, on 9:20:00, 18:20:00 (i.e. twice a day).<br />
          In general, write * for week, month and day, 0 for seconds, and just modify the hours and minutes.<br />
          More examples：
          <ul>
            <li>Execute at 13:30:40 and 20:30:40 every day: <code>40 30 13,20 * * *</code> ( 2 times a day, about 60 times a month, completely free of charge)</li>
            <li>Execute at 8:00:00, 13:00:00 and 21:00:00 every day:<code>0 0 8,13,21 * * *</code> ( 3 times a day, about 90 times a month)</li>
            <li>Execute at every hour&apos;s 10 minutes and 0 seconds, 45 minutes and 0 seconds. <code>0 10,45 * * * *</code> (2 times a hour, 48 times per day, about 1440 times per month)</li>
          </ul>
        </p>
        <p {...cn('no-select')}>We used <code>node-cron</code> inside to parse cron patterns / syntax, go to  &nbsp;
          <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/kelektiv/node-cron/blob/master/README.md#available-cron-patterns">https://github.com/kelektiv/node-cron/blob/master/README.md#available-cron-patterns</a>
          &nbsp; for some clues.  (// Add more explanations here)
          </p>
          <p {...cn('no-select')}>Also, we do not support <code>/</code> showing in cron syntax, because we run tasks in distributed / decentralized
          global servers, it is hard to sync all of their times, so please DO NOT use syntax like <code>* * */4 * * *</code>
          (execute every 4 hours), <br/>
          however, you CAN point out exact numbers seperated with a comma<code>,</code>  , like 
          <code>* * 0,4,8,12,16,20 * * *</code>(execute on every day&apos;s 0,4,6,8,12,16 and 20 o&apos;clock.) ,  
          that syntax / pattern works also every 4 hours in fact, it is better for our global servers to arrange our tasks. 
          </p>
        <h2 id="WhatIsCssSelector"> What Is CSS selector ?</h2>
        <p>
          CSS selector is a CSS style selector, it is a string that describes a group of HTML elements.  <br />
          You can use it to select a group of HTML elements.  <br />
          A tutorial located at <a target="_blank" rel="noopener noreferrer" href="https://webpagemonitor.net/webpagemonitor_doc_site/docs-en/FAQ/How%20to%20find%20CSS%20selector/index.html" >here</a>.
        </p>
        <h2 id="WhatIsEraserScript"> What Is a Eraser Script ?</h2>
        <p>As there are many advertisements and elements you do not care about, 
          One eraser script provides a way to remove no-use DOM elements and results.   <br/>
          There are two types of eraser scripts: <br/>
          One is called <code>DOM eraser</code>, it will remove DOM elements by css selectors inside the puppeteer chromium browser. <br/>
          One is called <code>Result eraser</code>, it will replace string by RegExp after the puppeteer chromium got the page&rsquo;s content. <br/>
          DO NOT DELETE the element you want to keep, and make sure the <b>CSS selector</b> field (when create task) <b>not conflict</b> with <b>eraser script</b>!!!<br/><br/>
          The whole flow basically is: puppeteer chromium open a page, <code>DOM eraser</code> erase no-use elements, got text contents,
          <code>Result eraser</code> replace no-use strings by RegExp, and finally save the text contents for later compares.
        </p>
        <h2 id="WhatIsScriptMarket"> What Is Script Market ?</h2>
        <p>
          As there are trillions of websites, and us (the creators of this service) cannot pre-define all Eraser Scripts,<br/>
          So, we provide a space to store Eraser Scripts defined by yourself, and search / use other user defined helpful scripts.
        </p>
        {/* <h2 id="WhatIsSimpleMode"> What Is Simple Mode ?</h2>
        <p>This is a recommended mode for beginners.  <br/>
          Type a URL, keep other field as default, clicke create button, that&apos;s done.</p>
        <h2 id="WhatisGeekMode"> What is Geek Mode ?</h2>
        <p>Write a piece of Node.js snippet, <br/>
        Customize Puppeteer&apos;s behaviors,<br/> 
        then watch pages need logged in or hidden in deeper links without a URL . <br/>
        Then notify you via your code defined endpoint, like mailgun , AWS mobile text message , or a firebase push... (WiP)
        </p> */}
        <h2 id="WhatIsACoupon"> What Is A Coupon Code?</h2>
        <p>
          Global users can charge points in a indirect way, for now.  <br/>
          You can use a coupon code to redeem more points.<br/>
          See details on our <Link prefetch={false} href="/member/redeem"><a>Redeem Page</a></Link>
        </p>
        <h2 id="TermsOfService"> {t('Terms of Service')} </h2>
        <p>
          Please see our <a href={t(`https://webpagemonitor.net/webpagemonitor_doc_site/docs-en/others/TOS/#TermsOfService`)} target="_blank" rel="noopener noreferrer">doc site</a>
        </p>
        <h2 id="PrivacyPolicy"> Privacy Policy </h2>
        <p>
        Please see our <a href={t(`https://webpagemonitor.net/webpagemonitor_doc_site/docs-en/others/PP/#PrivacyPolicy`)} target="_blank" rel="noopener noreferrer">doc site</a>
        </p>

        </> : null
      }
      {
        locale === 'zh' ? <>
        <h1>常见问题</h1>
        <h2 id="WhatCanThisSiteDo"> 这个网站能做什么？</h2>
        <p>监控/检测一个网页的变化，向你发送电子邮件提醒，或电话提醒（开发中）。
          <br/> 另请参阅 <Link prefetch={false} href="/about"><a>关于</a></Link> 页面。
        </p>
        <h2> 为什么我应该选择你的服务，而不是选择其他服务商？</h2>
        <p>开源，价格合理，我们使用现代技术，如Headless Chromium。
          所以你可以在云端或通过本地部署源码，来监控/检测你想要的任何URL。
          <br/> 另请参阅 <Link prefetch={false} href="/about"><a>关于</a></Link> 页面。
        </p>
        <h2 id="WhatIsACronSyntaxCronPattern"> 什么是Cron定时任务表达式？</h2>
        <p {...cn('no-select')}>
          Cron表达式举例： <code>0 20 9,18 * * *</code>（含有：数字，英文半角逗号，英文半角*，空格）<br />
          从左到右依次代表： 秒 分 时 日 月 星期， 所以含义为： 每天的9点20分0秒、18点20分0秒执行（即每天两次）。<br />
          一般情况下，星期、月、日写*，秒写0，修改时、分即可。<br />
          更多例子：
          <ul>
            <li>每天的13点30分40秒、20点30分40秒执行： <code>40 30 13,20 * * *</code> （每天执行2次，每月约60次，完全免费）</li>
            <li>每天的8点、13点、21点执行（都在0分0秒）：<code>0 0 8,13,21 * * *</code> （每天执行3次，每月约90次）</li>
            <li>每小时的10分0秒、45分0秒执行： <code>0 10,45 * * * *</code> （每小时执行2次，每天48次，每月约1440次）</li>
          </ul>
        </p>
        <p {...cn('no-select')}>我们使用内置的 <code>node-cron</code> 来解析Cron定时任务表达式  &nbsp; 你可以去
          <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/kelektiv/node-cron/blob/master/README.md#available-cron-patterns">https://github.com/kelektiv/node-cron/blob/master/README.md#available-cron-patterns</a>
          &nbsp; 查看更多信息。
        </p>
          <p {...cn('no-select')}>与此同时, 不支持输入 <code>/</code> 在Cron表达式里, 因为我们在分布式的多个全球服务器上运行任务。
          全球服务器中运行，很难同步所有的时间，所以请不要使用 <code>* * */4 * * *</code>(每四小时执行一次) 这样的Cron表达式。
          <br/>
          你可以输入用 <code>,</code> 隔开的多个数字, 比如 
          <code>* * 0,4,8,12,16,20 * * *</code>(每天的 0,4,6,8,12,16和20点执行) ,  
          上述表达式实际上也是每4个小时工作一次，用这样的表达式可以让全球的服务器更好地安排任务。
          </p>
        <h2 id="WhatIsCssSelector"> 什么是 CSS选择器 ?</h2>
        <p>
          你可以用CSS选择器来选择你需要的页面上的某一些元素。<br />
          如何找到某个网页区域的CSS选择器，教程 <a target="_blank" rel="noopener noreferrer" href="https://a-1251786267.file.myqcloud.com/webpagemonitor_doc_site/docs-zh/FAQ/How%20to%20find%20CSS%20selector/index.html" >在这里</a>.
        </p>
        <h2 id="WhatIsEraserScript">什么是橡皮脚本 ?</h2>
        <p>考虑到有许多广告和你不关心的元素， 
          一个橡皮擦脚本提供了一个删除无用DOM元素和结果的方法。  <br/>
          有两种类型的橡皮脚本： <br/>
          一种是 <code>DOM橡皮</code> ，你可以用CSS选择器移除Puppeteer Chromium浏览器内的DOM元素。 <br/>
          另一种是 <code>结果橡皮</code> ，你可以用正则表达式替换/格式化Puppeteer Chromium得到页面内容后的字符串。 <br/>
          **不要删除**你想保留的元素，并确保创建任务时的<b>CSS选择器</b>不与<b>橡皮脚本</b>冲突!!!<br/><br/>
          整个流程基本上是：Puppeteer Chromium打开一个页面，<code>DOM橡皮</code>擦除不使用的元素，得到文本内容，
          <code>结果橡皮</code>用RegExp（正则表达式）替换无用字符串，最后保存文本内容，再执行接下来的对比。
        </p>
        <h2 id="WhatIsScriptMarket"> 什么是脚本市场？</h2>
        <p>
          由于有数以万亿计的网站，而我们（这项服务的创造者）无法预先定义好所有的橡皮脚本。<br/>
          因此，我们提供了一个云空间来存储自己定义的橡皮脚本，并搜索/使用其他用户已创建好的橡皮脚本。
        </p>
        {/* <h2 id="WhatIsSimpleMode"> 什么是简单模式？</h2>
        <p>This is a recommended mode for beginners.  <br/>
          Type a URL, keep other field as default, clicke create button, that&apos;s done.</p>
        <h2 id="WhatisGeekMode"> What is Geek Mode ?</h2>
        <p>Write a piece of Node.js snippet, <br/>
        Customize Puppeteer&apos;s behaviors,<br/> 
        then watch pages need logged in or hidden in deeper links without a URL . <br/>
        Then notify you via your code defined endpoint, like mailgun , AWS mobile text message , or a firebase push... (WiP)
        </p> */}
        <h2 id="WhatIsACoupon"> 什么是优惠券/充值代码？</h2>
        <p>
          目前，海外用户可以以间接的方式充值点数。  <br/>
          你可以使用优惠券/充值代码来充值更多的积分。<br/>
          在<Link prefetch={false} href="/member/redeem"><a>充值页面</a></Link>查看更多详情。
        </p>
        <h2 id="TermsOfService"> {t('Terms of Service')} </h2>
        <p>
          请参阅 <a href={t(`https://webpagemonitor.net/webpagemonitor_doc_site/docs-en/others/TOS/#TermsOfService`)} target="_blank" rel="noopener noreferrer">文档页面</a>
        </p>
        <h2 id="PrivacyPolicy"> 隐私政策 </h2>
        <p>
          请参阅 <a href={t(`https://webpagemonitor.net/webpagemonitor_doc_site/docs-en/others/PP/#PrivacyPolicy`)} target="_blank" rel="noopener noreferrer">文档页面</a>
        </p>
        </> : null
      }
      {/* @ts-ignore */}
      <a onClick={clickGoBack(router)}>Go back</a>
    </div>
  </main>);
}

export default FaqPage;
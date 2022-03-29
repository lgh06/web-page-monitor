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
          When you use the Service, you agree to abide by the Terms of Service. Please be sure to carefully read and fully understand the content of each clause, especially the clauses that exclude or limit liability.<br />
          If you do not agree to the TOS, or if you do not accurately understand the TOS in its entirety, please do not proceed with subsequent operations. <br />

          <h4>I. Services</h4>
          The services provided by this platform include but are not limited to：<br />
          Provide webpage change alert service, including but not limited to webpage content change alert, keyword appearance alert, etc.<br />

          <h4>II. Laws and regulations</h4>
          As the platform is <b>not</b> aware of the laws and regulations of each country and <b>whether</b> the links you enter are allowed to be crawled regularly, 
          you need to ensure that you comply with the laws and regulations of your country and mainland China, 
          as well as the user agreement of the provider of the monitored pages.<br />
          All timed monitor actions on this platform are submitted by the individual or organization to which the user account belongs, 
          and all monitor tasks on this website <b>shall be</b> considered as the actions of the individual or organization of the user.
          The platform does not provide any specific scripts in advance for detecting specific web pages, 
          and the platform <b>does not</b> assume joint and several responsibility for violations and misconducts by individual users or organizations.<br />
          If an individual user or organization has violated the law or any misconduct, the platform reserves the right to immediately stop the service, transfer the illegal account data to the public security authorities, and delete the account without refund or prior notice.
          
          <h4 id="RefundPolicy">III. Refund policy.</h4>
          Since the platform provides free points to accounts every month for you to pre-experience and test the effectiveness of the service, <b>no</b> refunds are allowed after you top up or redeem points.<br />

          <h4>IV. Service availability</h4>
          The platform guarantees monthly availability &gt;= 95%, i.e. monthly downtime is no more than 36 hours.<br />
          When the main URL of this service is temporarily unavailable, an alternate URL will be released through the official account. When both the main URL and the alternate URL are unavailable, it will be considered as down.<br />
          If the downtime in the previous month or the current month is longer than the above guarantee, users <b>who have paid in the previous month or the current month</b> can ask us to compensate you for the number of hours *3 that the downtime in the previous month or the current month exceeds 36 hours.<br />
          It is important to note that the above guarantees do not represent a guarantee of success for each web page detection or notification alert delivery.<br />
          The platform has used a combination of Amazon Cloud and AliCloud email delivery services to maximize email delivery rates.<br />
          Since the success of each web page detection depends on the configuration of the specific options and various factors, the platform <b>cannot</b> guarantee the success of each/every detection task, please use free points in advance to confirm that the platform can detect specific web pages.  <br />
          And since some web pages may have a live detection mechanism, the success of this task does not mean that the next task will be successful, so please try to reduce the detection frequency.<br />

          <h4>V. Special Reminder</h4>
          <b>Do not</b> apply the services of the platform to important and special occasions, the services of the platform are limited to daily scenarios, and the platform is <b>not</b> responsible for any direct/indirect losses of any kind caused by the use of the services.<br />
          <br />
          In case of inconsistency between the English version of the Terms of Service and the Chinese version of the Terms of Service, 
          the Chinese version of the Terms of Service shall prevail.
          <br />
          If you have any other questions, please contact us by logging in and checking the contact information on the recharge page.
          
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
          当您使用本服务时，您同意遵守本服务条款，请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款。<br />
          如果您不同意本服务条款，或者无法准确理解本服务条款的全部内容，请您不要进行后续操作。 <br />

          <h4>一、服务内容</h4>
          本平台提供的服务内容包括但不限于：<br />
          提供网页变动提醒服务，包括但不限于网页内容变动提醒、关键词出现提醒等。<br />

          <h4>二、法律法规</h4>
          由于本平台<b>无法</b>获知各个国家的法律法规以及您输入的网页链接<b>是否</b>允许定时爬取，
          您本人需要确保您遵守您所在国家与中国大陆的法律法规，同时需要遵守所检测网页的提供方的用户协议。<br />
          本平台上的所有定时检测行为均由用户账号所属的个人或组织提交，本网站上的所有检测任务<b>均应</b>视为用户个人或组织的行为，
          本平台并<b>不</b>预先提供任何特定的脚本供检测特定的网页，本平台<b>不承担</b>因用户个人或组织的违法违规与不当行为的连带责任。<br />
          如果用户个人或组织出现了违法违规或任何不当行为，本平台保留立即停止服务、将违法违规的账号数据移交公安机关、并删除账号、且不退款也不预先通知的权利。
          
          <h4 id="RefundPolicy">三、退款政策</h4>
          由于本平台每月都会为账号提供免费的点数，供您预先体验与测试服务的有效性，因此在您充值或兑换点数后，<b>不</b>允许退款。<br />

          <h4>四、服务可用性</h4>
          本平台保证每月可用性&gt;=95%, 即每月宕机时间不大于36小时。<br />
          当本服务的主网址暂时不可用时，会通过官方账号发布备用的网址，当主网址与备用网址均不可用时，才视为宕机。<br />
          若上月或当月宕机时长大于上述保证，上月或当月有<b>付费</b>行为的用户可要求我们以上月或当月宕机超过36小时的小时数*3来补偿您的点数。<br />
          需要注意的是，以上保证不代表对每个网页检测是否成功或通知提醒是否发送成功的保证。<br />
          本平台已综合使用亚马逊云与阿里云的邮件发送服务来尽可能提升邮件送达率。<br />
          由于每个网页检测是否成功取决于具体选项的配置以及多方面因素，本平台<b>不能</b>保证每个/每次检测任务都能够成功，请预先使用免费点数来确认本平台可以检测特定网页。  <br />
          且由于某些网页可能有真人检测机制，本次任务的检测成功不代表下次任务也能成功，因此请尽量降低检测频率。<br />

          <h4>五、特别提醒</h4>
          <b>不要</b>把本平台的服务应用于重要、特别场合，本平台的服务仅限日常场景，本平台<b>不</b>对任何使用本服务造成的各种直接/间接损失负责。<br />
          <br />

          如果英语版本的服务条款与中文版本的服务条款不一致，以中文版本的服务条款为准。<br />
          如果您还有其他疑问，请登录后查看充值页面的联系方式，来联系我们。
          
        </p>
        </> : null
      }
      {/* @ts-ignore */}
      <a onClick={clickGoBack(router)}>Go back</a>
    </div>
  </main>);
}

export default FaqPage;
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { useEffect, useLayoutEffect, useState } from "react";
import { clickGoBack, genClassNameAndString, useHeadTitle, useI18n } from "../helpers";
import styles from "../styles/modules/about.module.scss";

const [cn,cs] = genClassNameAndString(styles);


const AboutPage: NextPage = () => {
  let router = useRouter();
  let { locale } = useI18n();
  let headTitle = useHeadTitle('About');

  return (<>
    {headTitle}
    <div {...cn('about-page')}>
      {
        locale === 'en' ? <>
        <h1>About</h1>
        <h2> What Can this site do?</h2>
        <p>Monitor / detect a web page changes continuously, at least ten minutes&apos; intervals, <b>on cloud</b>.<br/> Send email alerts or phone alerts (under development) if a web page changes or a specified keyword appears.
          <br/> See also <Link href="/faq"><a>FAQ</a></Link> page.
        </p>
        <h2>Give me the scenarios / use cases please ?</h2>
        <p>The application scenario is very wide. Theoretically supports detecting any publicly available web page. (Detection of web pages that require login to view is under development)
          <ul>
            <li>Check if a job site has posted a new job.</li>
            <li>Check if a website has new information on tender announcements and bid winning announcements.</li>
            <li>Check if a certain examination website has released the results to avoid waiting for a long time.</li>
            <li>And so on.</li>
          </ul>
        </p>
        <h2>Differences and advantages compared to other websites? <br/> Why should I choose you ? </h2>
        <p>Main advantages:
          <ul>
            <li>
            Cloud detection, <b>no</b> always open PC anymore, save on electricity costs. If turn on your own computer for a month, the electricity bill is far greater than $1!
            </li>
            <li>Cheap and affordable. 80 free checks per month; minimum top-up of 1 US dollar to get 500 checks.<br/>
              The minimum detection interval is currently 10 minutes for both free and paid users。
            </li>
            <li>Just click the mouse, enter the URL and fill in a few options. <b>No</b> need to install various software plug-ins on this machine.
            </li>
            <li>Developers are Chinese, responding quickly to various issues and developing and updating versions quickly.</li>
            <li>Servers are currently deployed within China mainland for now, which allows for faster and more accurate web updates due to low network latency and fewer detection failures compared to similar services abroad. (Multiple detection server locations and global detection servers, are under development)
            </li>
            <li>
              Adopt various ways to avoid false alarms and excessive disturbance and improve mail delivery rate:
              <ol>
                <li>Support setting CSS element selector to detect web changes only in specified areas to avoid false alerts</li>
                <li>Supports using CSS element selectors again to remove unwanted elements and adapt to more complex pages within the above specified area.&nbsp;See also: &nbsp;
                  <Link href="/faq#WhatIsEraserScript">
                    <a>Eraser Script</a>
                  </Link>
                </li>
                <li>Support for using regular expressions to remove unwanted information or formatting results after the page content has been fetched (after above two steps).&nbsp;See also: &nbsp;
                  <Link href="/faq#WhatIsEraserScript">
                    <a>Eraser Script</a>
                  </Link>
                </li>
                <li>Email alerts for the same task are sent up to once every 6 hours by default.(The ability to customize the frequency of email notifications is under development)</li>
                <li>Use Amazon AWS and AliCloud email delivery services to improve email delivery rates and avoid mails going to spam.</li>
              </ol>
            </li>
            <li>
            The project is open source, but commercial and profit-making activities are prohibited. ( For commercial and deployment support, please contact the developer. 
              For detailed license agreements see the License information at the following link: )<br/>
              Github  Link： <a href="https://github.com/lgh06/web-page-monitor" target="_blank" rel="noopener noreferrer">here</a><br/>
              Coding Link： <a href="https://lgh06.coding.net/public/web-page-monitor/web-page-monitor/git" target="_blank" rel="noopener noreferrer">here</a>
            </li>
          </ul>
        </p>
        </> : null
      }
      {
        locale === 'zh' ? <>
        <h1>关于</h1>
        <h2> 这个网站能做什么? </h2>
        <p><b>云端</b>持续定时监控/检测一个网页的变化，间隔最小十分钟。 <br/> 如网页有变化或指定的关键词出现，
          便发送电子邮件提醒，或电话提醒（开发中）。
          <br/> 另请参阅 <Link href="/faq"><a>常见问题</a></Link> 页面。
        </p>
        <h2> 主要应用场景是什么? 举个例子？ </h2>
        <p>理论上支持检测任何公开的网页（检测需要登录后才能查看的网页，功能正在开发中）。应用场景非常广泛， 比如： 
          <ul>
            <li>查看某招聘网站有没有发新的招聘信息；</li>
            <li>查看某网站是不是有了新的招标公告、投标中标公告信息；</li>
            <li>查看某考试网站是不是发布了成绩，避免苦苦等待，漫漫无期；</li>
            <li>等等其他你需要查看网页更新/变动的场景。</li>
          </ul>
        </p>
        <h2> 与其他网站相比有什么不同与优势? 为什么选择我们的服务？ </h2>
        <p>主要优势：
          <ul>
            <li>
              云端检测，<b>不用</b>挂机，节省电费。自己开电脑一个月，仅电费一项，就远远大于10元！
            </li>
            <li>便宜，负担得起。每月赠送80次检测次数；最低充值2元(人民币)，即可获取200次检测次数。<br/>
              无论免费用户与付费用户，目前的最小检测间隔均为10分钟。
            </li>
            <li>点点鼠标，输入网址，填写几个选项即可。本机<b>不用</b>安装各种软件插件。
            </li>
            <li>开发者身处中国大陆，快速响应各种问题，快速开发与更新版本。</li>
            <li>服务器目前部署在中国境内，相比国外同类服务，网络延迟低、<b>检测失败少</b>，可以更快更准确地获取网页更新。
                （多检测点、海外检测点，正在开发中）
            </li>
            <li>
              采用多种手段，避免误报与过度打扰，提升邮件送达率：
              <ol>
                <li>支持设置CSS元素选择器，仅检测指定区域的网页变动，避免误报</li>
                <li>支持在上述指定区域内，再次使用CSS元素选择器，移除不需要的元素，适配更加复杂的页面。&nbsp;参见: &nbsp;
                  <Link href="/faq#WhatIsEraserScript">
                    <a>橡皮脚本</a>
                  </Link>
                </li>
                <li>支持在已获取页面内容(上述两步)之后，使用正则表达式，移除不需要的信息或格式化结果。&nbsp;参见: &nbsp;
                  <Link href="/faq#WhatIsEraserScript">
                    <a>橡皮脚本</a>
                  </Link>
                </li>
                <li>同一任务的邮件提醒，默认每6小时最多发送一次。（自定义邮件通知频率的功能正在开发中）</li>
                <li>使用亚马逊AWS和阿里云的邮件发送服务，提升邮件送达率，避免垃圾邮件误报。</li>
              </ol>
            </li>
            <li>
              项目已开源，但禁止商用及盈利行为。( 如需商业及部署支持，请联系开发者。
              详细的许可协议参见以下链接内的License信息：)<br/>
              Github  开源地址： <a href="https://github.com/lgh06/web-page-monitor" target="_blank" rel="noopener noreferrer">链接</a><br/>
              Coding开源地址： <a href="https://lgh06.coding.net/public/web-page-monitor/web-page-monitor/git" target="_blank" rel="noopener noreferrer">链接</a>
            </li>
          </ul>
        </p>
        {/* @ts-ignore */}
        {/* <a onClick={clickGoBack(router)}>Go back</a> */}
        
        </> : null
      }
    </div>
  </>);
}

export default AboutPage;
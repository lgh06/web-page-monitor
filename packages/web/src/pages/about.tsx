import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { useEffect, useLayoutEffect, useState } from "react";
import { clickGoBack, genClassNameAndString } from "../helpers";
import styles from "../styles/modules/about.module.scss";

const [cn,cs] = genClassNameAndString(styles);


const AboutPage: NextPage = () => {
  let router = useRouter();
  let { locale } = router;
  useLayoutEffect(() => {

  })
  return (<>
    <div {...cn('about-page')}>
      {
        locale === 'en' ? <>
          <h1>About</h1>
          <h2> What Can This Site Do?</h2>
          <p>Watch / Monitor a web page&apos;s changes. <br/> If one page changes or one word you specify shows up,
            then send you a email alert, or phone call alert (Work in Progress).</p>
          {/* @ts-ignore */}
          <a onClick={clickGoBack(router)}>Go back</a>
        </> : null
      }
      {
        locale === 'zh' ? <>
        <h1>关于</h1>
        <h2> 这个网站能做什么? </h2>
        <p><b>云端</b>持续定时监控/检测一个网页的变化，间隔最小十分钟。 <br/> 如网页有变化或指定的关键词出现，
          便发送电子邮件提醒，或电话提醒（开发中）。</p>
        <h2> 与其他网站相比有什么不同与优势? 为什么选择我们的服务？ </h2>
        <p>主要优势：
          <ul>
            <li>
              云端检测，不用挂机，节省电费。自己开电脑一个月，仅电费一项，就远远大于10元！
            </li>
            <li>便宜，负担得起。每月赠送80次检测次数；最低充值2元(人民币)，即可获取200次检测次数。<br/>
              无论免费用户与付费用户，目前的最小检测间隔均为10分钟。
            </li>
            <li>点点鼠标，输入网址，填写几个选项即可。本机不用安装各种软件插件。
            </li>
            <li>开发者身处中国大陆，快速响应各种问题，快速开发与更新版本。</li>
            <li>服务器目前部署在中国境内，相比国外同类服务，网络延迟低、出错少，可以更快更准确地获取网页更新。
                <br/>（多检测点、海外检测点，正在开发中）
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
                <li>支持在获取页面内容(上述两步)之后，使用正则表达式移除不需要的信息。&nbsp;参见: &nbsp;
                  <Link href="/faq#WhatIsEraserScript">
                    <a>橡皮脚本</a>
                  </Link>
                </li>
                <li>邮件提醒默认6小时发送一次。自定义邮件通知频率的功能正在开发中</li>
                <li>使用亚马逊AWS和阿里云的邮件发送服务，提升邮件送达率，避免垃圾邮件误报。</li>
              </ol>
            </li>
          </ul>
        </p>
        {/* @ts-ignore */}
        <a onClick={clickGoBack(router)}>Go back</a>
        
        </> : null
      }
    </div>
  </>);
}

export default AboutPage;
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
// import styles from "../styles/modules/faq.module.css"
import { clickGoBack } from "../helpers";

const FaqPage: NextPage = () => {
  let router = useRouter()
  return (<>
    <style jsx>{`
      a{
        color: blue;
        margin-left: 3rem;
        cursor: pointer;
      }
      h1, h2{
        margin-left: 3rem;
      }
      p{
        margin-left: 3rem;
      }
      p > a{
        margin-left: 0;
      }
      p > span{
        background: #eee;
        font-size: 1rem;
        padding: 0 0.2rem;
      }
    `}</style>
    <h1>FAQ // TODO 中文版</h1>
    <h2> What Can This Site Do?</h2>
    <p>Watch / Monitor a web page&apos;s changes, send you a email alert, or phone call alert (Work in Progress).</p>
    <h2> Why should I choose your service, not choose A,B,C...?</h2>
    <p>Open Source, affordable, and we use modern techniques like Headless Chromium, 
      so you can watch any URL you want, on the cloud, or on your local computer</p>
    <h2 id="WhatIsACronSyntaxCronPattern"> What Is A Cron Syntax / Cron Pattern ?</h2>
    <p>We used <span>node-cron</span> inside to parse cron patterns / syntax, go to  &nbsp;
      <a target="_blank" rel="noreferrer" href="https://github.com/kelektiv/node-cron/blob/master/README.md#available-cron-patterns">https://github.com/kelektiv/node-cron/blob/master/README.md#available-cron-patterns</a>
      &nbsp; for some clues.  (// Add more explanations here)
      </p>
      <p>Also, we do not support <span>/</span> showing in cron syntax, because we run tasks in distributed / decentralized
      global servers, it is hard to sync all of their times, so please DO NOT use syntax like <span>* * */4 * * *</span>
       (execute every 4 hours), <br/>
      however, you CAN point out exact numbers seperated with a comma<span>,</span>  , like 
      <span>* * 0,4,8,12,16,20 * * *</span>(execute on every day&apos;s 0,4,6,8,12,16 and 20 o&apos;clock.) ,  
      that syntax / pattern works also every 4 hours in fact, it is better for our global servers to arrange our tasks. 
      </p>
    <h2> What Is Simple Mode ?</h2>
    <p>This is a recommended mode for beginners.  <br/>
      Type a URL, keep other field as default, clicke create button, that&apos;s done.</p>
    <h2> What is Geek Mode ?</h2>
    <p>Write a piece of Node.js snippet, <br/>
    Customize Puppeteer&apos;s behaviors,<br/> 
    then watch pages need logged in or hidden in deeper links without a URL . <br/>
    Then notify you via your code defined endpoint, like mailgun , AWS mobile text message , or a firebase push... (WiP)
    </p>
    {/* @ts-ignore */}
    <a onClick={clickGoBack(router)}>Go back</a>
  </>);
}

export default FaqPage;
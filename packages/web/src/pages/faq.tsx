import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { useEffect, useLayoutEffect, useState } from "react";
import { clickGoBack } from "../helpers";

const FaqPage: NextPage = () => {
  let router = useRouter()
  let [highlight, setHighlight] = useState('');
  let [hash, setHash] = useState('')
  useLayoutEffect(() => {
    if(window?.location.hash){
      setHash(String(window.location.hash));
      setHighlight('highlight');
    }else{
      setHighlight('')
    }
  })
  return (<>
    <style jsx>{`
      a{
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
      .highlight ${hash}{
        background-color: lightpink;
      }
    `}</style>
    <div className={highlight}>
      <h1>FAQ // TODO 中文版</h1>
      <h2 id="WhatCanThisSiteDo"> What Can This Site Do?</h2>
      <p>Watch / Monitor a web page&apos;s changes, send you a email alert, or phone call alert (Work in Progress).</p>
      <h2> Why should I choose your service, not choose A,B,C...?</h2>
      <p>Open Source, affordable, and we use modern techniques like Headless Chromium, 
        so you can monitor any URL you want, on the cloud, or on your local computer</p>
      <h2 id="WhatIsACronSyntaxCronPattern"> What Is A Cron Syntax / Cron Pattern ?</h2>
      <p>We used <code>node-cron</code> inside to parse cron patterns / syntax, go to  &nbsp;
        <a target="_blank" rel="noreferrer" href="https://github.com/kelektiv/node-cron/blob/master/README.md#available-cron-patterns">https://github.com/kelektiv/node-cron/blob/master/README.md#available-cron-patterns</a>
        &nbsp; for some clues.  (// Add more explanations here)
        </p>
        <p>Also, we do not support <code>/</code> showing in cron syntax, because we run tasks in distributed / decentralized
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
        DO NOT DELETE the element you want to keep, and make sure the <b>CSS selector</b> field <b>not conflict</b> with <b>eraser script</b>!!!<br/><br/>
        The whole flow basically is: puppeteer chromium open a page, <code>DOM eraser</code> erase no-use elements, got text contents,
        <code>Result eraser</code> replace no-use strings by RegExp, and finally save the text contents for later compares.
      </p>
      <h2 id="WhatIsScriptMarket"> What Is Script Market ?</h2>
      <p>
        As there are trillions of websites, and us (the creators of this service) cannot pre-define all Eraser Scripts,<br/>
        So, we provide a space to store Eraser Scripts defined by yourself, and search / use other user defined helpful scripts.
      </p>
      <h2 id="WhatIsSimpleMode"> What Is Simple Mode ?</h2>
      <p>This is a recommended mode for beginners.  <br/>
        Type a URL, keep other field as default, clicke create button, that&apos;s done.</p>
      <h2 id="WhatisGeekMode"> What is Geek Mode ?</h2>
      <p>Write a piece of Node.js snippet, <br/>
      Customize Puppeteer&apos;s behaviors,<br/> 
      then watch pages need logged in or hidden in deeper links without a URL . <br/>
      Then notify you via your code defined endpoint, like mailgun , AWS mobile text message , or a firebase push... (WiP)
      </p>
      {/* @ts-ignore */}
      <a onClick={clickGoBack(router)}>Go back</a>
    </div>
  </>);
}

export default FaqPage;
// https://github.com/puppeteer/puppeteer/blob/v13.0.1/docs/api.md
// https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=outline
import { CONFIG } from "./CONFIG.mjs";
import puppeteer from 'puppeteer';
import * as domEraser from './domEraser/index.mjs';

async function simpleModeTask({browser, taskDetail}){
  try {
    let {pageURL, cssSelector, detectMode, detectWord} = taskDetail;
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    await page.goto(pageURL,{waitUntil: 'networkidle2'});
  
    await page.waitForSelector(cssSelector);
    let matchedElement = await page.$(cssSelector);
    // TODO dynamic domEraser
    let oneDomEraser = domEraser.qq;
    let {urlRegExpArr} = oneDomEraser;
    if( urlRegExpArr.find(reg => pageURL.match( new RegExp(reg) ) ) ){
      let evaluateResult = await page.evaluate((oneDomEraser) =>{
        let {selectorArr, mode} = oneDomEraser;
        if(Array.isArray(selectorArr) && selectorArr.length){
          selectorArr.forEach(v => {
            if(mode === 'html'){
              document.querySelector(v).innerHTML = ''
            }else if(mode === 'text'){
              document.querySelector(v).innerText = ''
            }else{ // undefined or 'both'
              document.querySelector(v).innerHTML = ''
              document.querySelector(v).innerText = ''
            }
          });
        }
      }, oneDomEraser);
      console.log('evaluateResult', evaluateResult);
    }
    let textContent = '';
    textContent = await matchedElement.evaluate((node) => node.innerText);
    textContent = String(textContent).trim().replace(/\n|\r|\s+/g, ' ');
    return textContent;
  } catch (error) {
    console.error(error);
    return 'server error';
  }
};

async function simpleMode(taskDetail) {
  // debug use.
  let debugLaunchOption = {
    slowMo: 250,
    headless: false,
    // one script cannot exceed this limit, in seconds. 
    limit: 10,
  }

  let prodLauchOption = {
    // TODO read limit from MQ from worker from DB.
    limit: 7,
  }
  let usedLauchOption = CONFIG.debug ? debugLaunchOption : prodLauchOption

  let browser, p1;
  try {
    browser = await puppeteer.launch(usedLauchOption);
    p1 = simpleModeTask({ browser, taskDetail });
  } catch (error) {
    console.error(error)
    return [null, error];
  }


  // close puppeteer browser after a timeout
  return Promise.race([
    p1,
    new Promise((_, reject) => setTimeout(() => reject(('pptr script timeout')), usedLauchOption.limit * 1000))
  ]).then(async (value) => {
    await browser.close();
    console.log('browser closed after script quit ok');
    return [value];
  }, async (reason) => {
    if (reason === 'pptr script timeout') {
      await browser.close();
      console.log('browser closed after exceed time limit')
    }
    return [null, reason];
  }).catch(async function (err) {
    await browser.close();
    console.error('error in tasks', err)
    return [null, err];
  }).finally(async function(){
    await browser.close();
    console.log(new Date())
  });
}

export { simpleMode }
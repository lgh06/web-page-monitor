// https://github.com/puppeteer/puppeteer/blob/v13.0.1/docs/api.md
// https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=outline
import { CONFIG } from "./CONFIG.mjs";
import puppeteer from 'puppeteer';
import { ESMImport } from "@webest/web-page-monitor-esm-loader"

async function simpleModeTask({ taskDetail, page }){
  try {
    let {pageURL, cssSelector, extra} = taskDetail;
    // const context = await browser.createIncognitoBrowserContext();
    // const page = await context.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    await page.goto(pageURL,{waitUntil: 'networkidle2'});
  
    await page.waitForSelector(extra.waitForSelector || cssSelector);
    let matchedElement = await page.$(cssSelector);
    // TODO dynamic domEraser
    // TODO domEraser may delete the matchedElement
    // mention this in FAQ some day.
    let eraserModuleArr = [];
    if(extra && extra.eraserArr && extra.eraserArr.length){
      for(let id of extra.eraserArr){
        try {
          let mod = await ESMImport(`${CONFIG.dynJSPath}${id}.js`);
          eraserModuleArr.push(mod);
        } catch (error) {
          console.error(`fetch script ${id} error`, error)
        }
      }
    }
    for(let mod of eraserModuleArr){
      let oneDomEraser = mod;
      if( 
          oneDomEraser
          && oneDomEraser.urlRegExpArr
          && oneDomEraser.urlRegExpArr.length
          && oneDomEraser.selectorArr
          && oneDomEraser.selectorArr.length
          && oneDomEraser.urlRegExpArr.find(reg => pageURL.match( new RegExp(reg) ) ) 
        ){
        await page.evaluate((oneDomEraser) =>{
          let {selectorArr, mode} = oneDomEraser;
          let delElements = function(selector, mode){
            let matchedEleArr = document.querySelectorAll(selector);
            if(matchedEleArr && matchedEleArr.length){
              matchedEleArr.forEach(ele =>{
                if(mode === 'html'){
                  ele.innerHTML = ''
                }else if(mode === 'text'){
                  ele.innerText = ''
                }else{ // undefined or 'both'
                  ele.innerHTML = ''
                  ele.innerText = ''
                }
              });
            }
          }
          if(Array.isArray(selectorArr) && selectorArr.length){
            selectorArr.forEach(selector => {
              delElements(selector, mode)
            });
          }
        }, oneDomEraser);
    }
      // pass a function to puppeteer page.evaluate is hard.
      // DO NOT do this.
      // https://stackoverflow.com/questions/47304665/how-to-pass-a-function-in-puppeteers-evaluate-method
    }
    let textContent = '';
    textContent = await matchedElement.evaluate((node) => node.innerText);
    textContent = String(textContent).trim().replace(/\n|\r|\s+/g, ' ');
    return textContent;
  } catch (error) {
    console.error(error);
    // TODO here is not so right
    return 'pptr error';
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
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    p1 = simpleModeTask({ taskDetail, page });
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
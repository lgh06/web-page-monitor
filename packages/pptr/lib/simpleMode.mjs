// https://github.com/puppeteer/puppeteer/blob/v13.0.1/docs/api.md
// https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=outline
import { CONFIG } from "./CONFIG.mjs";
import puppeteer from 'puppeteer';


async function simpleModeTask({browser, taskDetail}){
  try {
    let {pageURL, cssSelector, detectMode, detectWord} = taskDetail;
    const page = await browser.newPage();
    await page.setViewport({
      width: 1902,
      height: 1080,
      deviceScaleFactor: 1,
    });
    await page.goto(pageURL);
  
    await page.waitForSelector(cssSelector);
    let matchedElement = await page.$(cssSelector);
    let textContent = '';
    textContent = await matchedElement.evaluate((node) => node.textContent);
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
    limit: 5,
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
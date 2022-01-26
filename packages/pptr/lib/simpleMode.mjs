// https://github.com/puppeteer/puppeteer/blob/v13.0.1/docs/api.md
// https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=outline
import { CONFIG } from "./CONFIG.mjs";

async function simpleModeTask({browser, taskDetail}){
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
  textContent = String(textContent).trim().replace(/\n|\r/g, ' ')
  return textContent;
};

async function simpleMode(taskDetail) {
  // debug use.
  let debugLaunchOption = {
    slowMo: 250,
    headless: false,
    // one script cannot exceed this limit, in seconds. 
    limit: 15,
  }

  let prodLauchOption = {
    // TODO read limit from MQ from worker from DB.
    limit: 5,
  }
  let usedLauchOption = CONFIG.debug ? debugLaunchOption : prodLauchOption

  const browser = await puppeteer.launch(usedLauchOption);

  let p1 = simpleModeTask({ browser, taskDetail });

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
  }).catch(function (err) {
    console.error('error in tasks', err)
    return [null, err];
  })
}

export { simpleMode }
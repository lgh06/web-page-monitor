// https://github.com/puppeteer/puppeteer/blob/v13.0.1/docs/api.md
// https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=outline
import { CONFIG } from "./CONFIG.mjs";
import puppeteer from 'puppeteer';
import { ESMImport } from "@webest/web-page-monitor-esm-loader"
// alias fetch to nodeFetch, so won't conflict with browser fetch
import nodeFetch from "node-fetch";

// this is a custom task executer.  
// task is fetch and imported from http url
async function customModeTask({ taskDetail, page }){
  try {

    let customScriptModule = await ESMImport(`${CONFIG.customScriptPath}${taskDetail._id}.js`);
    let execResult = await customScriptModule.exec({taskDetail, page, nodeFetch});

    return execResult;
  } catch (error) {
    console.error(error);
    // TODO here is not so right
    return 'pptr customModeTask error';
  }
};

// this is a wrapper to limit single task's execute time
async function customMode({taskDetail}) {
  // debug use.
  let debugLaunchOption = {
    slowMo: 250,
    headless: false,
    // one script cannot exceed this limit, in seconds. 
    limit: 10,
  }

  let prodLauchOption = {
    // https://github.com/puppeteer/puppeteer/issues/1175
    args: [
      '--disable-dev-shm-usage',
      '--disable-infobars',
      '--window-size=1440,810',
      '--window-position=0,0',
      '--ignore-certificate-errors',
      '--disable-extensions',
      '--no-first-run',
      '--disable-notifications',
    ],
    headless: true,
    ignoreHTTPSErrors: true,
    defaultViewport: {
      width: 1440,
      height: 810,
    },
    // TODO read limit from MQ from worker from DB.
    limit: 7,
  }
  let usedLauchOption = CONFIG.debug ? debugLaunchOption : prodLauchOption;

  let browser, p1;
  try {
    browser = await puppeteer.launch(usedLauchOption);
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    p1 = customModeTask({ taskDetail, page });
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
    console.log('browser closed, script quit ok')
    return [value];
  }, async (reason) => {
    if (reason === 'pptr script timeout') {
      await browser.close();
      console.log('browser closed, exceed time limit')
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

export { customMode }
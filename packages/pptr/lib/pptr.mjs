'use strict';
import puppeteer from 'puppeteer';


async function pptr() {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  let now = Date.now()
  await page.screenshot({ path: `shots/${now}.png` });

  await browser.close();

}

pptr();

export { pptr, pptr as default }

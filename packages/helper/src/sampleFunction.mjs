export const  sampleFunction = `async function task({browser}: {browser: Browser}){
  const page = await browser.newPage();
  await page.setViewport({
    width: 1902,
    height: 1080,
    deviceScaleFactor: 1,
  });
  let url = "http://www.yuanyang.gov.cn/channels/443.html"
  await page.goto(url);
  let selector = ".neirong table";
  await page.waitForSelector(selector);
  let matchedElement = await page.$(selector);
  let textContent = await matchedElement.evaluate((node) => node.textContent);
  // to do something else, like post this textContent to another URL ? ...` + '\n' +
'\
}' + '\n' + '\
export { task }';
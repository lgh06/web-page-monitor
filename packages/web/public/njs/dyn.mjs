function a(){
  console.log('ahahaha');
  console.log('ahahaha');
  console.log('ahahaha');
};

async function task({browser, fs}){
  const page = await browser.newPage();
  await page.setViewport({
    width: 1902,
    height: 1080,
    deviceScaleFactor: 1,
  });
  let url = "http://www.yuanyang.gov.cn/channels/443.html"
  await page.goto(url);
  let now = Date.now()
  let selector = ".neirong table";
  await page.waitForSelector(selector);
  let matchedElement = await page.$(selector);
  let textContent = await matchedElement.evaluate((node) => node.textContent);
  textContent = String(textContent).trim().replace(/\n\ +\n/g, '\n')

  let filename = `${encodeURIComponent(url)}_${selector.replace(" ", "")}_${now}.txt`
  fs.writeFileSync(`shots/${filename}`, textContent)

  await page.screenshot({ path: `shots/${now}.png` });
};

export {task, task as default}
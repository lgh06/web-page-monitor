export const  sampleFunctionCreateTask = `async function task({browser}){
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

export const  sampleFunctionCreateScript3 = `
// selectorArr / mode used after puppeteer open one page ready, to remove some DOM elements
export const selectorArr = ['#List > div','#Copyright', 'body > div > div.qq_content.cf.slide-wrap'];
export const mode = 'html'; // html / text / both. if empty,  is both

// URL matcher, if empty, this file won't have any effect
export const urlRegExpArr = ['news.qq.com'];

// func used after puppeteer process closed, to erase / replace some result contents
export function replace(result) {
  // erase 227万次播放
  result = result.replace(/\ \\d+万?次播放\ /g, ' ');
  // console.log('step 1', result);
  // erase 转评赞
  result = result.replace(/\ (((\\d+\.+\\d|\\d+)万?)\ ){3}/g, ' ');
  // erase 昨天 19:12 昨天 3:00
  result = result.replace(/\ 昨天 \\d{1,2}:\\d{2}\ /g, ' ');
  // erase 1-15 05:19
  result = result.replace(/\ \\d{1,2}-\\d{1,2} \\d{1,2}:\\d{2} /g, ' ');
  // erase 9小时前 3分钟前 刚刚 5:19
  result = result.replace(/\ (\\d{1,2}小时前|\\d{1,2}分钟前|刚刚|\\d{1,2}:\\d{2})\ /g, ' ');
  // erase 转 评 赞
  result = result.replace(/\ (转发|\\d+)\ (评论|\\d+)\ (赞|\\d+)\ /g, ' ');
  // erase 2021-9-19
  result = result.replace(/\ \\d{4}-\\d{1,2}-\\d{1,2}\ /g, ' ');
  return result
}

`;

export const sampleFunctionCreateScript1 = `
export const selectorArr = ['#List > div','#Copyright', 'body > div > div.qq_content.cf.slide-wrap'];

export const urlRegExpArr = ['news.qq.com'];

export const mode = 'html'; // html / text / both. if empty,  is both
`;

export const sampleFunctionCreateScript2 = `
// TODO
// let user define erasers like this

// this is a result eraser written by regexp
export function replace(result) {
  // erase 227万次播放
  result = result.replace(/\ \\d+万?次播放\ /g, ' ');
  // console.log('step 1', result);
  // erase 转评赞
  result = result.replace(/\ (((\\d+\.+\\d|\\d+)万?)\ ){3}/g, ' ');
  // erase 昨天 19:12 昨天 3:00
  result = result.replace(/\ 昨天 \\d{1,2}:\\d{2}\ /g, ' ');
  // erase 1-15 05:19
  result = result.replace(/\ \\d{1,2}-\\d{1,2} \\d{1,2}:\\d{2} /g, ' ');
  // erase 9小时前 3分钟前 刚刚 5:19
  result = result.replace(/\ (\\d{1,2}小时前|\\d{1,2}分钟前|刚刚|\\d{1,2}:\\d{2})\ /g, ' ');
  // erase 转 评 赞
  result = result.replace(/\ (转发|\\d+)\ (评论|\\d+)\ (赞|\\d+)\ /g, ' ');
  // erase 2021-9-19
  result = result.replace(/\ \\d{4}-\\d{1,2}-\\d{1,2}\ /g, ' ');
  return result
}

export const urlRegExpArr = ['m.weibo.cn']
`;

export const sampleFunctionCreateCustomTask1 = `
// cron syntax REQUIRED
export const cronSyntax = '0 0,10,20,30,40,50 * * * *';

// endTime REQUIRED , timestamp , miliseconds
export const endTime = Date.now() + 1000 * 60 * 60 * 24 * 7;

// the function to execute a task.
export async function exec({taskDetail, page, nodeFetch}){
  console.log('exec a example task in custom mode: ', Date.now());

}

`;
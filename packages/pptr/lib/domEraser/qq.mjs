const selectorArr = ['#List > div','#Copyright', 'body > div > div.qq_content.cf.slide-wrap'];

const urlRegExpArr = ['news.qq.com'];

const mode = 'html'; // html / text / both. if empty,  is both

export const qq = {
  // func,
  mode,
  selectorArr,
  urlRegExpArr,
}
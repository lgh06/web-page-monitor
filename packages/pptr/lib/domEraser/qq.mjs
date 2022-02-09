function func(selectorArr){
  if(Array.isArray(selectorArr) && selectorArr.length){
    selectorArr.forEach(v => {
      document.querySelector(v).innerText = ''
      document.querySelector(v).innerHTML = ''
    });
  }
}

const selectorArr = ['#List > div','#Copyright', 'body > div > div.qq_content.cf.slide-wrap'];

const urlRegExpArr = ['news.qq.com']

export const qq = {
  func,
  selectorArr,
  urlRegExpArr,
}
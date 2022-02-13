let trans = {
  "Welcome to Here": "欢迎使用网页监控系统",
  "please input a url start with https:// or http://": "请输入以https://或http://开头的网址",
  "URL check passed. ": "URL检查通过",
}

let enTrans = {};
let zhTrans = {};
Object.keys(trans).forEach(v => {
  enTrans[v] = v;
  zhTrans[v] = trans[v];
})

const transResources = {
  en: {
    translation: enTrans
  },
  zh: {
    translation: zhTrans
  }
};

export { transResources }
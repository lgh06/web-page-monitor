let trans = {
  // Below is on home page
  "Welcome to Web Page Monitor": "欢迎使用网页变动通知系统",
  "Please": "请",
  "Login": "登录",
  "Daniel Gehuan Liu": "阿欢课堂",
  "Created by": "创建者",
  // Below is on login page
  "Create a task in Simple Mode": "创建一个简单模式的任务",
  "Go Back to home": "返回首页",
  "Log Out": "退出登录",
  "Welcome": "欢迎",
  "Login with Gitee.com OAuth": "使用Gitee.com OAuth登录",
  // Below is on create task page
  "Please input a url start with https:// or http://": "请输入以https://或http://开头的网址",
  "URL check passed. ": "URL检查通过",
  "Recommended": "推荐",
}

let enTrans = {};
let zhTrans = {};
Object.keys(trans).forEach(v => {
  enTrans[v] = v;
  zhTrans[v] = trans[v];
  zhTrans[String(v).toLowerCase()] = trans[v];
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
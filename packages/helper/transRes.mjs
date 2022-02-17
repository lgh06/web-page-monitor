let trans = {
  // Below is on home page
  "Welcome to Web Page Monitor": "欢迎使用网页变动通知系统",
  "Web Page Monitor": "网页变动通知系统",
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
  "Please input a URL start with https:// or http://": "请输入以https://或http://开头的网址",
  "URL check passed. ": "URL检查通过",
  "Recommended": "推荐",
  "Choose an end time, from 10 minutes later to 7 days later": "选择一个结束时间，从10分钟后到7天（最晚）",
  "Please Input a cron syntax" : "请输入Cron定时任务表达式",
  "Cron Syntax Help in FAQ": "什么是Cron定时任务表达式",
  "Please input a CSS selector, if you do not know what that is, keep it as default \"body\"": `请输入CSS选择器，如果不知道填什么，请使用默认值body`,
  "Please input an alias name of this task, or keep it as default": "为该任务起个名字，或者保持默认值",
  "Notify you when": "通知您，当",
  "Page Changes": "页面变动时",
  "Word(s) Show up": "词语（文字）出现时",
  "Please input some words, multiple words can be separated by commas": "请输入一些词语（文字）,多个词语之间可以用逗号分隔",
  "Note: Simple Mode is only suitable for monitor web pages,\
      not for txt, xml or other files without HTML structure.<br/>\
      Our Geek Mode will be coming soon, for more advanced features.":
  "注意：简单模式仅适用于监控网页，\
      不适用于txt,xml或其他没有HTML结构的文件。<br/>\
      我们的极客(高级)模式将很快开放，将有更多的高级功能等待您发掘。",
  "Note: If the combination of cron syntax and cssSelector and pageURL are same,\
      this will update existing task, not create a new one.":
  "注意：如果cron表达式和css选择器和网址相同，\
      则会更新已有任务，而不会创建新任务。",
  "Note: We need 15 minutes to distribute our tasks to different servers. <br/>\
      the first repeated task within 15 minutes will be ignored.":
  "注意：我们需要15分钟分配任务到不同的服务器。<br/>\
      在15分钟内的第一个重复任务将被忽略。",
  "Create Now": "立即创建",
  "Go back to user center": "返回用户中心",
  "Go to scripts market": "前往脚本市场",

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
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
  "Please input eraser script IDs": "请输入橡皮脚本ID",
  "One line one id, 3 erasers max": "一行一个ID，最多3个橡皮脚本",
  "You can find more erasers on Script Market": "您可以在脚本市场上找到更多橡皮脚本",
  "Eraser Script in FAQ": "什么是橡皮脚本",
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
  "submit OK. You can close this page.": "提交成功，您可以关闭该页面。",
  // below is on script market page
  "Script Market": "脚本市场",
  "No Data": "没有数据",
  "Scripts created by you": "您创建的脚本",
  "Public Scripts": "公开的脚本",
  "Update": "更新",
  "Script Unique ID": "脚本唯一ID",
  "You can modify the script name, or keep its name same as before": "您可以修改脚本名称，或保持原名称",
  "Go back to Market home": "返回脚本市场首页",
  "Create a script": "创建一个脚本",
  "Back to create task simple mode": "回到创建简单模式任务",
  "Go to script market": "前往脚本市场",
  "Edit / Delete": "编辑/删除",
  "Edit": "编辑",
  "Delete": "删除",
  "domains applied to": "应用到的域名",
  "alias": "别名",
  "Please choose an field to search": "请选择一个搜索字段",
  "script id": "脚本ID",
  "script alias": "脚本别名",
  "domain": "域名",
  "Please Input": "请输入",
  "Search a public script": "搜索公开脚本",
  "View": "查看",
  "Notice: All scripts you created will be <strong>public</strong>, you can only modify your own scripts.": "注意：所有您创建的脚本将会<strong>公开</strong>，您只能修改自己的脚本。",
  "Please input a script name, or keep it empty to use the default name": "请输入一个脚本名称，或保持默认值",
  "Create Script Now": "立即创建脚本",
  "Please modify the example code!": "请修改示例代码！",
  "Script length too long! need <= 5000 characters": "脚本长度太长，需要 <= 5000 个字符",
  "Please choose an example": "请选择一个示例",
  "DOM eraser": "DOM,橡皮脚本",
  "RegExp result replace eraser": "正则表达式替换,橡皮脚本",
  "one file, two type eraser": "一个文件包含两种类型的橡皮脚本",
  "Are you sure to delete this script": "您确定要删除这个脚本吗",
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
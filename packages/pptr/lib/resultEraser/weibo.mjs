// TODO
// let user define erasers like this

// this is a result eraser written by regexp
export function replace(result) {
  // erase 227万次播放
  result = result.replace(/\ \d+万?次播放\ /g, ' ');
  // console.log('step 1', result);
  // erase 转评赞
  result = result.replace(/\ (((\d+\.+\d|\d+)万?)\ ){3}/g, ' ');
  // erase 昨天 19:12 昨天 3:00
  result = result.replace(/\ 昨天 \d{1,2}:\d{2}\ /g, ' ');
  // erase 1-15 05:19
  result = result.replace(/\ \d{1,2}-\d{1,2} \d{1,2}:\d{2} /g, ' ');
  // erase 9小时前 3分钟前 刚刚 5:19
  result = result.replace(/\ (\d{1,2}小时前|\d{1,2}分钟前|刚刚|\d{1,2}:\d{2})\ /g, ' ');
  // erase 转 评 赞
  result = result.replace(/\ (转发|\d+)\ (评论|\d+)\ (赞|\d+)\ /g, ' ');
  // erase 2021-9-19
  result = result.replace(/\ \d{4}-\d{1,2}-\d{1,2}\ /g, ' ');
  return result
}

export const urlRegExpArr = ['m.weibo.cn']
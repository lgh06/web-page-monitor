// TODO
// let user define erasers like this

async function weiboEraser({ result, taskDetail }) {
  if (taskDetail && taskDetail.pageURL && taskDetail.pageURL.includes('m.weibo.cn')) {
    // erase 227（万）次播放
    result = result.replace(/\ \d+万?次播放\ /g, ' ');
    // console.log('step 1', result);
    // erase 转评赞
    result = result.replace(/\ (((\d+\.+\d|\d+)万?)\ ){3}/g, ' ');
    // erase 昨天 19:12 昨天 3:00
    result = result.replace(/\ 昨天 \d{1,2}:\d{2}\ /g, ' ');
    // erase 1-15 05:19
    result = result.replace(/\ \d{1,2}-\d{1,2} \d{1,2}:\d{2} /g, ' ');
  }
  return result
}

export { weiboEraser as default, weiboEraser };
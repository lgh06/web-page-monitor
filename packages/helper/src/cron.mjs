import { CronTime } from "cron"
/**
 * get next 3 timestamps (13 digit, miliseconds) from cron syntax
 * UTC timestamp
 * @param {string} cron cron syntax,see https://github.com/kelektiv/node-cron/blob/5626867f67d80cce411d2b0f14f3a64063df99c6/lib/time.js#L148
 * @returns {Array} 3 timestamps (13 digit, miliseconds)
 */
 function getNextTimes(cron){
  let ctArr = new CronTime(cron).sendAt(3);
  // UTC timestamp in miliseconds / English time
  // time return by CronTime are in Momentjs format, using luxon lib.
  // .toISOString() / .valueOf() / .format('ddd')
  // https://momentjs.com/docs/#/displaying/
  // let convertedArr2 = ctArr.map(v => v.toISOString());
  // console.log(convertedArr2)
  let convertedArr = ctArr.map(v => v.valueOf());
  return convertedArr
}

let cron = {
  getNextTimes
}

export { cron }
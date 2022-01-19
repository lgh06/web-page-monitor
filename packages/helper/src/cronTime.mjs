import { CronTime as CT } from "cron"

 function getNextTimes(cron){
  let ctArr = new CT(cron).sendAt(3);
  // UTC timestamp in miliseconds / English time
  // time return by CronTime are in Momentjs format, using luxon lib.
  // .toISOString() / .valueOf() / .format('ddd')
  // https://momentjs.com/docs/#/displaying/
  // let convertedArr2 = ctArr.map(v => v.toISOString());
  // console.log(convertedArr2)
  let convertedArr = ctArr.map(v => v.valueOf());
  return convertedArr
}


  function toLocalISOString(oneDate, plusMinutes = 0){
    let offset = oneDate.getTimezoneOffset();
    return new Date(oneDate.setMinutes(oneDate.getMinutes()-offset + plusMinutes)).toISOString().substring(0, 16)
  }

let CronTime = {
  getNextTimes,
  toLocalISOString,
}

export { CronTime }
import { CronTime as CT } from "cron"

function getNextTimes(cron, count = 500) {
  let ctArr;
  try {
    ctArr = new CT(cron).sendAt(count);
  } catch (error) {
    ctArr = null;
    return ctArr
  }
  // UTC timestamp in miliseconds / English time
  // time return by CronTime are in Momentjs format, using luxon lib.
  // .toISOString() / .valueOf() / .format('ddd')
  // https://momentjs.com/docs/#/displaying/
  // let convertedArr2 = ctArr.map(v => v.toISOString());
  // console.log(convertedArr2)
  let convertedArr = ctArr.map(v => v.valueOf());
  return convertedArr
}


function toLocalISOString(oneDate, plusMinutes = 0) {
  let aNewDate = new Date(oneDate);
  let offset = aNewDate.getTimezoneOffset();
  return new Date(aNewDate.setMinutes(aNewDate.getMinutes() - offset + plusMinutes)).toISOString().substring(0, 16)
}

function checkTimes(timestampArr, firstJobMinutes = 10, betweenJobMinutes = 10) {
  if(!timestampArr || !timestampArr[0]){
    return [false, ['please check the cron syntax']]
  }
  // let now = Date.now();
  let errors = new Set();
  timestampArr.forEach((v, i, a) => {
    // TODO different type user, diff later / between time
    // below logic moved to API when API got a task.
    // if (i === 0) {
    //   if ((v - now) < 60 * firstJobMinutes * 1000) {
    //     errors.add(`first job need ${firstJobMinutes} minutes later, please check. `);
    //   }
    // }
    if (i >= 1) {
      if ((v - a[i - 1]) < 60 * betweenJobMinutes * 1000) {
        errors.add(`between every jobs, need >= ${betweenJobMinutes} minutes, please check. `);
      }
    }
  });
  let errorArr = Array.from(errors);
  if (errorArr.length) {
    return [false, errorArr]
  } else {
    return [true];
  }
}

let CronTime = {
  getNextTimes,
  toLocalISOString,
  checkTimes,
}

export { CronTime }
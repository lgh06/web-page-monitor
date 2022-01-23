import { getDB } from './lib/index.mjs';
import { DateTime } from "luxon";

async function checker(){

  let now = Date.now(); // timestamp
  let dateNow = new Date(now);


  let db = await getDB();
  let minutesLater = function(now, minutes){
    return new Date(now).valueOf() + 60 *1000 * minutes;
  }
  db.collection('task').find({
    nextExecuteTime:{
      $gte: minutesLater(now, 10)
    }
  }).toArray().then(docs => {
    // console.log(docs)
    // console.log(new Date(docs[0].nextExecuteTime))
  });

  // https://moment.github.io/luxon/#/tour?id=your-first-datetime
  // https://moment.github.io/luxon/api-docs/index.html#datetimeplus
  // const dt = DateTime.fromMillis(now);
  // const minute = dt.minute;
  // let nowMinute = new Date(now).getMinutes();

  let getNext10Minute = function(now, count=1){
    let next10Minute = parseInt((new Date(now).getMinutes() + count*10)/10) * 10;
    let nextHour = 0;
    if(next10Minute >= 60){
      next10Minute = next10Minute % 60;
      nextHour = 1
    }else{
      nextHour = 0;
    }
    let next10MinuteTimestamp = new Date(now).setHours(
        dateNow.getHours()+nextHour,
        next10Minute,
        0,
        0
      ); 
    return [nextHour, next10Minute, next10MinuteTimestamp];
  } 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setHours
  console.log(new Date(getNext10Minute(now, 1)[2]), new Date(getNext10Minute(now, 2)[2]-1), dateNow)
}


export { checker }
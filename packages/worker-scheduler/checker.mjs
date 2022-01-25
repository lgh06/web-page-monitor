import { getDB } from './lib/index.mjs';
import { DateTime } from "luxon";

async function checker(){

  let now = Date.now(); // timestamp


  let db = await getDB();
  if(!db) return;
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
  }).catch(e => console.log(e));

  // https://moment.github.io/luxon/#/tour?id=your-first-datetime
  // https://moment.github.io/luxon/api-docs/index.html#datetimeplus
  // const dt = DateTime.fromMillis(now);
  // const minute = dt.minute;
  // let nowMinute = new Date(now).getMinutes();

  let getNextStepMinute = function(timestamp, step = 10,count=1){
    let nextStepMinute = parseInt((new Date(timestamp).getMinutes() + count * step ) / step) * step;
    let nextHour = 0;
    if(nextStepMinute >= 60){
      nextHour = parseInt( nextStepMinute / 60 )
      nextStepMinute = nextStepMinute % 60;
      // console.log('inside above', nextHour, nextStepMinute, count)
    }else{
      nextHour = 0;
      // console.log('inside below', nextHour, nextStepMinute, count)
    }
    let nextStepMinuteTimestamp = new Date(timestamp).setHours(
        new Date(timestamp).getHours()+nextHour,
        nextStepMinute,
        0,
        0
      ); 
    return [nextHour, nextStepMinute, nextStepMinuteTimestamp];
  } 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setHours
  let step = 5;
  console.log(getNextStepMinute(now, step))
  console.log(new Date(getNextStepMinute(now, step)[2]), new Date(getNextStepMinute(now, step, 2)[2]-1), new Date(now))
}


export { checker }
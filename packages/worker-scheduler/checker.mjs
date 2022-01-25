import { getDB } from './lib/index.mjs';

let getNextStepMinuteTimestamp = function(timestamp, step = 5,count=1){
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
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setHours
  let nextStepMinuteTimestamp = new Date(timestamp).setHours(
      new Date(timestamp).getHours()+nextHour,
      nextStepMinute,
      0,
      0
    ); 
  // console.log(nextHour, nextStepMinute, nextStepMinuteTimestamp);
  return nextStepMinuteTimestamp;
}

let getNextTimeSection = function(timestamp, step, count = 1){
  return [
    // new Date(
      getNextStepMinuteTimestamp(timestamp, step, count)
    // )
    , 
    // new Date(
      getNextStepMinuteTimestamp(timestamp, step, count+1)-1
    // )
  ]
}

async function checker(){

  let now = Date.now(); // timestamp

  let db = await getDB();
  if(!db) return;
  let minutesLater = function(now, minutes){
    return new Date(now).valueOf() + 60 *1000 * minutes;
  }
  return db.collection('task').find({
    nextExecuteTime:{
      $gte: getNextStepMinuteTimestamp(now, 5, 1),
      $lt: getNextStepMinuteTimestamp(now, 5, 2)
    }
  }).toArray().then(docs => {
    console.log(docs)
    if(docs && docs.length){
      console.log(new Date(docs[0].nextExecuteTime))
    }
  }).catch(e => console.log(e));

  // https://moment.github.io/luxon/#/tour?id=your-first-datetime
  // https://moment.github.io/luxon/api-docs/index.html#datetimeplus
  // const dt = DateTime.fromMillis(now);
  // const minute = dt.minute;
  // let nowMinute = new Date(now).getMinutes();
  // console.log(getNextTimeSection(now, 5, 1), new Date(now))
}


export { checker, getNextStepMinuteTimestamp, getNextTimeSection }
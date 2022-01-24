import { getDB } from './lib/index.mjs';
import { DateTime } from "luxon";



let now = Date.now();
async function checker(){
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
    console.log(new Date(docs[0].nextExecuteTime))
  });

  // https://moment.github.io/luxon/#/tour?id=your-first-datetime
  const dt = DateTime.fromMillis(now);
  // const minute = dt.minute;
  let minute = 65;
  let next10Minute = parseInt((minute + 10)/10) * 10;
  let nextHour = 0;
  if(next10Minute >= 60){
    next10Minute = next10Minute % 60;
    nextHour = 1
  }else{
    nextHour = 0;
  }
  console.log(minute, next10Minute, nextHour)
}


export { checker }
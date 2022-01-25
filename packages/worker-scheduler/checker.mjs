import { getDB } from './lib/index.mjs';
import { CronTime } from '@webest/web-page-monitor-helper';


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

async function normalChecker(now){

  now = now || Date.now(); // timestamp

  let db = await getDB();
  if(!db) return;

  return db.collection('task').find({
    nextExecuteTime:{
      $gte: getNextStepMinuteTimestamp(now, 5, 1),
      $lt: getNextStepMinuteTimestamp(now, 5, 2)
    }
  // TODO pagination and be careful for memory leak. future.
  }).toArray().then(docs => {
    if(docs && docs.length){
      docs.forEach(doc => {
        // TODO send jobs to MQ and execute quicker

        db.collection(tableName).updateOne({_id: doc._id}, {'$set': {
          nextExecuteTime: CronTime.getNextTimes(doc.cronSyntax, 2)[0]
        }}).catch(e => console.log(e))
      });
    }
  }).catch(e => console.log(e));
}

async function errorChecker(now){

  now = now || Date.now(); // timestamp

  let db = await getDB();
  if(!db) return;

  let tableName = 'task';

  return db.collection(tableName).find({
    $and:[
      {
        nextExecuteTime:{
          $lt: getNextStepMinuteTimestamp(now, 5, 1)
        }
      },
      {
        endTime:{
          $gt: now
        }
      },
    ]
  // TODO pagination and be careful for memory leak. future.
  }).toArray().then(docs => {
    if(docs && docs.length){
      
      docs.forEach(doc => {
        // TODO send jobs to MQ and execute quicker

        db.collection(tableName).updateOne({_id: doc._id}, {'$set': {
          nextExecuteTime: CronTime.getNextTimes(doc.cronSyntax, 2)[0]
        }}).catch(e => console.log(e))
      });
    }
  }).catch(e => console.log(e));

}


export { normalChecker, errorChecker, getNextStepMinuteTimestamp, getNextTimeSection }
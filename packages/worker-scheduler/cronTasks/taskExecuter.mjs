import { normalChecker, errorChecker } from './cronTaskChecker.mjs';
import { resultSaver } from './resultSaver.mjs';
import * as amqp from 'amqplib';
import { amqpHelper } from '@webest/web-page-monitor-helper/node/index.mjs';

import { CONFIG } from "../CONFIG.mjs";

let connString = CONFIG.mqConnString
let amqpHelperInstance = new amqpHelper(connString, true);

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function taskExecuter() {
  console.log('workerScheduler start on:', new Date());

  // the worker for cron jobs
  // read tasks from DB `task` table
  async function intervalExecuter (){
    let prevNormalCheckerMinute;
    let prevErrorCheckerMinute;
    
    setInterval(async function(){
      let nowDate = new Date();
      let now = nowDate.valueOf()
      let nowMinute = nowDate.getMinutes();

      // normalChecker will be executed every 5 minutes
      if ( nowMinute % 5 === 0 && prevNormalCheckerMinute !== nowMinute ){
        prevNormalCheckerMinute = nowMinute;
        // setInterval may not await, but errors can be easily catched.
        // this channel will be closed on normalChecker end
        let conn, channel;
        conn = await amqpHelperInstance.getConn();
        // HOLD ON
        // Here may be memory leak, if too many connections are waiting
        // for amqp connection, and amqp connection is broken.
        // inside setInterval, do not hang up if no conn, just return.
        // if(!conn) return;
        channel = await conn.createChannel();
        await normalChecker(now, channel);
      }

      // errorChecker will be executed every 5 minutes
      // errorChecker not send MQ, only change nextExecuteTime
      if ( nowMinute % 5 === 0 && prevErrorCheckerMinute !== nowMinute ){
        prevErrorCheckerMinute = nowMinute;
        // setInterval may not await, but errors can be easily catched.
        await errorChecker(now);
      }

    }, 18*1000);

  }

  intervalExecuter()
  resultSaver();
  
}

export { taskExecuter , taskExecuter as default}
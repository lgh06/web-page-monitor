import { normalAdder, errorAdder } from "./cronPointsAdder.mjs";

function pointsMonthlyExecuter(){

  setInterval(async function(){

    let prevNormalAdderMinute;
    let prevErrorAdderMinute;

    let nowDate = new Date();
    let now = nowDate.valueOf()
    let nowMinute = nowDate.getMinutes();

    // normalAdder will be executed every 5 minutes
    if ( nowMinute % 5 === 0 && prevNormalAdderMinute !== nowMinute ){
      prevNormalAdderMinute = nowMinute;
      await normalAdder(now);
    }

    // errorAdder will be executed every 5 minutes
    if ( nowMinute % 5 === 0 && prevErrorAdderMinute !== nowMinute ){
      prevErrorAdderMinute = nowMinute;
      await errorAdder(now);
    }

  }, 18*1000);

}

export { pointsMonthlyExecuter, pointsMonthlyExecuter as default}
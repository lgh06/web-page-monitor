import { normalAdder, errorAdder } from "./cronPointsAdder.mjs";

async function pointsMonthlyExecuter(){

  setInterval(async function(){

    let prevNormalAdderMinute;
    let prevErrorAdderMinute;

    let nowDate = new Date();
    let now = nowDate.valueOf()
    let nowMinute = nowDate.getMinutes();

    // normalAdder will be executed every 5 minutes
    if ( nowMinute % 5 === 0 && prevNormalAdderMinute !== nowMinute ){
      prevNormalAdderMinute = nowMinute;
      try {
        await normalAdder(now);
      } catch (error) {
        console.error(error)
      }
    }

    // errorAdder will be executed every 5 minutes
    if ( nowMinute % 5 === 0 && prevErrorAdderMinute !== nowMinute ){
      prevErrorAdderMinute = nowMinute;
      try {
        await errorAdder(now);
      } catch (error) {
        console.error(error)
      }
    }

  }, 18*1000);

}

export { pointsMonthlyExecuter, pointsMonthlyExecuter as default}
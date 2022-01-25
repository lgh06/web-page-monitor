import { normalChecker, errorChecker } from './checker.mjs';

async function main() {

  async function fakeTaskOne (){
    return new Promise((resolve, reject) => {
      setTimeout(function(){
        console.log('fake task executed on', new Date())
        resolve('ok');
      }, 3000)
    })
  }

  function intervalExecuter (){
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
        try {
          await normalChecker(now);
        } catch (error) {
          console.log(error)
        }
      }

      // errorChecker will be executed every 10 minutes
      if ( nowMinute % 5 === 0 && prevErrorCheckerMinute !== nowMinute ){
        prevErrorCheckerMinute = nowMinute;
        // setInterval may not await, but errors can be easily catched.
        try {
          await errorChecker(now);
        } catch (error) {
          console.log(error)
        }
      }

    }, 18*1000);

  }

  intervalExecuter()
}


main()
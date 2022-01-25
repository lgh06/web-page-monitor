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
    setInterval(function(){
      let nowDate = new Date();
      let now = nowDate.valueOf()
      let nowMinute = nowDate.getMinutes();
      if ( nowMinute % 5 === 0 && prevNormalCheckerMinute !== nowMinute ){
        prevNormalCheckerMinute = nowMinute;
        normalChecker(now);
      }
      if ( nowMinute % 60 === 0 && prevErrorCheckerMinute !== nowMinute ){
        prevErrorCheckerMinute = nowMinute;
        errorChecker(now);
      }
    }, 25*1000);

  }

  intervalExecuter()
}


main()
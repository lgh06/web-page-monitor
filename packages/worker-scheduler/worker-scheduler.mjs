import { checker } from './checker.mjs';

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
    let prevExecutedMinute;
    setInterval(function(){
      let nowDate = new Date();
      let nowMinute = nowDate.getMinutes();
      if ( nowMinute % 5 === 0 && prevExecutedMinute !== nowMinute ){
        prevExecutedMinute = nowMinute;
        console.log(nowDate);
        fakeTaskOne();
      }
    }, 20*1000);

  }

  intervalExecuter()
  await checker();
}


main()
import { io } from "socket.io-client";
import { CONFIG } from "./CONFIG.mjs"
import { CronTime } from "cron"


async function workerScheduler() {

}

async function main() {
  const socket = io(CONFIG.socketio, { autoConnect: false });
  // TODO add token or other encrypt way
  let userInfo = { email: 'hnnk@qq.com', type: "worker" };
  socket.auth = { userInfo };
  if (userInfo.email && !socket.connected) {
    connectSocketIO({ socket });
  }
  let nextArr = getNextTimes('6 * * * * *');
  console.log(nextArr)
}

async function connectSocketIO({ socket }) {
  if (socket.connected) {
    return;
  }
  socket.on("connect", () => {
    console.log(socket.id);
  });

  socket.on("disconnect", () => {
    console.log(socket.id); // undefined
  });

  let times = 0
  // socket.on('room' + socket.auth.userInfo.email, (arg) => {
  //   times++;
  //   console.log(times, arg)
  // })
  socket.on('backroom', arg =>{
    console.log( new Date().toLocaleString(), arg)
  })
  setInterval(() =>{
    socket.emit("backroom", "hi from worker-scheduler")
  }, 6000)
  socket.on("disconnect", (arg) => {
    console.log("disconnected by some reason")
  })
  socket.connect();
}

main()

/**
 * get next 3 timestamps (13 digit, miliseconds) from cron syntax
 * UTC timestamp
 * @param {string} cron cron syntax,see https://github.com/kelektiv/node-cron/blob/5626867f67d80cce411d2b0f14f3a64063df99c6/lib/time.js#L148
 * @returns {Array} 3 timestamps (13 digit, miliseconds)
 */

function getNextTimes(cron){
  let ctArr = new CronTime(cron).sendAt(3);
  // UTC timestamp in miliseconds / English time
  // time return by CronTime are in Momentjs format, using luxon lib.
  // .toISOString() / .valueOf() / .format('ddd')
  // https://momentjs.com/docs/#/displaying/
  // let convertedArr2 = ctArr.map(v => v.toISOString());
  // console.log(convertedArr2)
  let convertedArr = ctArr.map(v => v.valueOf());
  return convertedArr
}

export { workerScheduler, getNextTimes }

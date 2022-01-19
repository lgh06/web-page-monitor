import { io } from "socket.io-client";
import { CONFIG } from "./CONFIG.mjs"
import { cron } from "@webest/web-page-monitor-helper";


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
  let nextArr = cron.getNextTimes('6 * * * * *');
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


export { workerScheduler }

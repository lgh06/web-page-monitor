// 'use strict';
import puppeteer from 'puppeteer';
import { CONFIG } from "./CONFIG.mjs"
import { io } from "socket.io-client";
import fs from "fs";
import { fetchImport } from "@webest/web-page-monitor-esm-loader"


async function pptr() {
  let { task } = await fetchImport (`${CONFIG.dynJSPath}dyntest.mjs`);

  // fetchImport(`${CONFIG.dynJSPath}dyn.mjs`)
  //   .then(mod=>console.log(mod))

  // debug use.
  let debugLaunchOption = {
    slowMo: 250,
    headless: false,
  }
  const browser = await puppeteer.launch(CONFIG.debug ? debugLaunchOption : {});

  // DO NOT DELETE.  BELOW LOGICS ARE LOAD DYNAMICALLY FROM
  // packages\web\src\pages\api\dynjs\[filename].ts

  await task({browser, fs});
  await browser.close();

}

// pptr();

async function main(){
  const socket = io(CONFIG.socketio, { autoConnect: false });
  // TODO add token or other encrypt way
  let userInfo = {email: 'hnnk@qq.com', type: "pptr"};
  socket.auth = { userInfo};
  if(userInfo.email && !socket.connected){
    connectSocketIO({socket});
  }
}

async function connectSocketIO({socket}){
  if(socket.connected) {
    return;
  }
  socket.on("connect", () => {
    console.log(socket.id);
  });

  socket.on("disconnect", () => {
    console.log(socket.id); // undefined
  });

  let times = 0
  socket.on('room' + socket.auth.userInfo.email, (arg) => {
    times++;
    console.log(times, arg)
    if(times % 5 === 0){
      pptr();
    }
  })
  socket.on("disconnect", (arg) => {
    console.log("disconnected by some reason")
  })
  socket.connect();
}

main();

export { pptr, pptr as default }

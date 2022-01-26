// 'use strict';
import puppeteer from 'puppeteer';
import { CONFIG } from "./CONFIG.mjs"
import { io } from "socket.io-client";
import fs from "fs";
import { task } from "./dyntest-example.mjs"

// https://github.com/puppeteer/puppeteer/blob/v13.0.1/docs/api.md
// https://pptr.dev/#?product=Puppeteer&version=v13.0.1&show=outline
async function pptr() {
  let beginTime = Date.now()
  
  // TODO get taskId and userInfo from socketio
  // let {taskId, userInfo} = infoFromSocketio

  // let { task } = await fetchImport (`${CONFIG.dynJSPath}dyntest.mjs`);

  // debug use.
  let debugLaunchOption = {
    slowMo: 250,
    headless: false,
    // one script cannot exceed this limit, in seconds. 
    // also used in production.
    limit: 15, 
  }

  let prodLauchOption = {
    limit: 5,
  }
  let usedLauchOption = CONFIG.debug ? debugLaunchOption : prodLauchOption

  const browser = await puppeteer.launch(usedLauchOption);

  let p1 =  task({browser, fs});

  // close puppeteer browser after a timeout
  Promise.race([
    p1,
    new Promise((_, reject) => setTimeout(() => reject(('pptr script timeout')), usedLauchOption.limit * 1000))
  ]).then(async (value) => {
    await browser.close();
    console.log('browser closed after script quit ok')
  }, async (reason)=>{
    if(reason === 'pptr script timeout'){
      await browser.close();
      console.log('browser closed after exceed time limit')
    }
  }).finally(()=>{
    let endTime = Date.now()
    let lastedSeconds = parseInt((endTime - beginTime ) / 1000)
    console.log('pptr executed seconds: ' + lastedSeconds)
  }).catch(function(err) {
      console.error('error in tasks', err)
  })
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
    // console.log(times, arg)
    if(times % 5 === 0){
      // pptr();
    }
  })

  socket.on('backroom', arg =>{
    console.log( new Date().toLocaleString(), arg)
  })
  setInterval(() =>{
    socket.emit("backroom", "hi from pptr")
  }, 7000)
  socket.on("disconnect", (arg) => {
    console.log("disconnected by some reason")
  })
  socket.connect();
}

main();

export { pptr, pptr as default }

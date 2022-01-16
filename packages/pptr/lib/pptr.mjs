'use strict';
import puppeteer from 'puppeteer';
import { CONFIG } from "./CONFIG.mjs"
import { io } from "socket.io-client";
import fs from "fs";


async function pptr() {

  // debug use.
  let debugLaunchOption = {
    slowMo: 250,
    headless: false,
  }
  const browser = await puppeteer.launch(CONFIG.debug ? debugLaunchOption : {});
  const page = await browser.newPage();
  await page.setViewport({
    width: 1902,
    height: 1080,
    deviceScaleFactor: 1,
  });
  let url = "http://www.yuanyang.gov.cn/channels/443.html"
  await page.goto('http://www.yuanyang.gov.cn/channels/443.html');
  let now = Date.now()
  let selector = ".neirong table";
  await page.waitForSelector(selector);
  let matchedElement = await page.$(selector);
  let textContent = await matchedElement.evaluate((node) => node.textContent);
  textContent = String(textContent).trim().replace(/\n\ +\n/g, '\n')

  let filename = `${encodeURIComponent(url)}_${selector.replace(" ", "")}_${now}.txt`
  fs.writeFileSync(`shots/${filename}`, textContent)

  await page.screenshot({ path: `shots/${now}.png` });

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

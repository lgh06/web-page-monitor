## web-page-monitor / 网页变动监控器  
> 英语 / English  

A toy based on puppeteer, mainly.  
Work in Progress.  
Puppeteer will be controlled by user defined JS, texted / inputted in browser.
Not released a minimal version yet.  
> Chinese / 简体中文 

一个主要基于Puppeteer的玩具。  
进行中。  
由用户在浏览器中预先输入的JS，操作puppeteer的行为。  
还未最小化可用。  

## Intro (English)  
`web` is the website, for end users to use. created by Next.js. Connected to MongoDB. **NO CONNECT** socketio for now.  
`pptr` is the puppeteer, connect socket.io.  
`socketio` is the data communication center. Connected with pptr and worker-scheduler.  
`worker-scheduler` connect to MongoDB and socket.io   
`esm-loader` NodeJS import(esm).then(..) from user defined js ( http URL ) .  


## 介绍  
`web` 最终用户使用的网站界面, 连接MongoDB, **暂不**连接socket.io  
`pptr` puppeteer执行程序, 连接socket.io  
`socketio` 信息中转站, 被pptr和worker-scheduler连接  
`worker-scheduler` 调度/分发控制器, 连接socket.io与MongoDB  
`esm-loader` NodeJS import(esm).then(..) from remote js ( http URL ) .  

## Requirements  
MongoDB (5.0)  
Node.JS (16)  
socket.io and web and MongoDB's server should have a public IP address.  

## ports (for dev)
Next.js 3002 ( will be on 80 / 443 in production, someday)  
Static HTML 3001 on production. (maybe, or just use Next.js )  
socket.io server 3003  

## Run  
```
npm install && npm run dev

```  

## License / 许可协议  
see [LICENSE.md](./LICENSE.md)

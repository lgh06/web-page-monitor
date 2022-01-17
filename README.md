## a mono repo.  
`web-page-monitor` is a website, for end users to use. created by Next.js  
`pptr` is the crawler.  
`socketio` is the data communication center.  

## Intro  
`web-page-monitor` 最终用户使用的网站界面, need to connect to MongoDB  
`pptr` puppeteer执行程序  
`socketio` 信息中转站  
`esm-loader` NodeJS import(esm).then(..) from remote js ( http URL ) .  
`worker-scheduler` 调度/分发控制器, need to connect to MongoDB  

## ports (for dev)
Next.js 3002 ( will be on 80 / 443 in production)  
Static HTML 3001 on production. (maybe, or just use Next.js )  
socket.io server 3003
## web-page-monitor / 网页变动监控器  
> 英语 / English  

Web Site Page Changes Monitor.  
Cloud watch & monitor web page's changes and updates.
Work in Progress.  
~~Puppeteer will be controlled by user defined JS, texted / inputted in browser.~~ Will do this in future.    
~~Not released a minimal version yet.~~  
Online Cloud Service: [Web Page Monitor](https://webpagemonitor.net/)  
Github source code : [Link](https://github.com/lgh06/web-page-monitor)  

> Chinese / 简体中文 

网站网页页面更新变更监控提醒，云端监控网页变动更新。 
进行中。  
~~由用户在浏览器中预先输入的JS，操作puppeteer的行为。~~  以后再实现  
~~还未最小化可用。~~    
体验地址:  [网页变动监控](https://monit.or.passby.me/)  
在Coding.net上的代码镜像: [浏览链接](https://lgh06.coding.net/public/web-page-monitor/web-page-monitor/git) （需要登录Coding才能查看） / 
[git clone链接](https://e.coding.net/lgh06/web-page-monitor/web-page-monitor.git)  

## Intro (English)  
- `web` is the website, for end users to use. created by Next.js. Connected to MongoDB. **NO CONNECT** ~~socket.io~~RabbitMQ for now.  
- `pptr` is the puppeteer, connect ~~socket.io~~RabbitMQ.  
- ~~`socketio` is the data communication center. Connected with pptr and worker-scheduler.~~ use RabbitMQ  
- `worker-scheduler` connect to MongoDB and ~~socket.io~~RabbitMQ   
- `esm-loader` NodeJS import(esm).then(..) from user defined js ( http URL ) .  


## 介绍  
- `web` 最终用户使用的网站界面, 连接MongoDB, **暂不**连接~~socket.io~~RabbitMQ  
- `pptr` puppeteer执行程序, 连接~~socket.io~~RabbitMQ    
- ~~`socketio` 信息中转站, 被pptr和worker-scheduler连接~~ 使用RabbitMQ  
- `worker-scheduler` 调度/分发控制器, 连接~~socket.io~~RabbitMQ与MongoDB  
- `esm-loader` NodeJS import(esm).then(..) from remote js ( http URL ) .  

## Requirements / Dependencies

- Erlang / OTP (23.2+), required by RabbitMQ  [link](https://github.com/erlang/otp/releases)   
- RabbitMQ (3.9+) [link](https://github.com/rabbitmq/rabbitmq-server/releases) , ~~and Web MQTT plugin enabled [how to enable web-mqtt](packages/vendor-scripts-n-configs/README.md)~~  
- [RabbitMQ Delayed Message Plugin](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases) / [install help](packages/vendor-scripts-n-configs/README.md)  

> Notice: if you are on windows, above two softwares' install path should only use ASCII compatible charactors.  

> Notice: If you are on other OS, install RabbitMQ manually.  

- MongoDB (5.0)  
- Node.JS (16)  

> Notice: For production, you should ensure your `pm2` auto start after your OS boot. [link](https://github.com/pm2-hive/pm2-hive.github.io/blob/330f518065e2e6b9e8befc7beddd1b076d6c2adf/docs/features/startup.md#windows-startup-script)  
> Notice: For production, you should ensure your `MongoB` and `RabbitMQ` auto start after your OS boot.  
> Notice: For production, ~~socket.io~~RabbitMQ and web and MongoDB's server should have a permanent public Internet IP address.  
> Notice: For local development, you can install all of sub-packages on one machine, the machine should have Internet access.  

> Windows installers mirror for China users:  
> https://trip.feishu.cn/docs/doccnHqaEoNo48vzqyWqgkxkm1s  

> some helper bat scripts located at [packages/vendor-scripts-n-configs/other_tools/](packages/vendor-scripts-n-configs/other_tools/) for start/stop mongodb/rabbitmq services.  
Open them **in GBK / GB2312 / ANSI** encoding, or delete the non-english characters.  
Please modify inner paths by yourself if you changed default install path or service name.  

## 要求与依赖  

- Erlang / OTP (版本23.2+), 因为RabbitMQ依赖此语言[link](https://github.com/erlang/otp/releases)  
- RabbitMQ （版本3.9+）[link](https://github.com/rabbitmq/rabbitmq-server/releases) , ~~并开启自带Web MQTT plugin [如何开启web-mqtt](packages/vendor-scripts-n-configs/README.md)~~   
- [RabbitMQ 延时消息插件](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases) / [如何安装与开启](packages/vendor-scripts-n-configs/README.md)  
> 注意：Windows安装Erlang、RabbitMQ时，安装路径不要有中文和奇怪符号，否则会安装失败  

> 注意：如果你用其他操作系统, 自己安装好RabbitMQ.  

- MongoDB (5.0)  
- Node.JS (16)  

> 注意：生产环境，你要确保pm2在你的系统中会自动启动。[文档链接](https://github.com/pm2-hive/pm2-hive.github.io/blob/330f518065e2e6b9e8befc7beddd1b076d6c2adf/docs/features/startup.md#windows-startup-script)  
> 注意：生产环境，你要确保MongoDB和RabbitMQ在你的系统中会自动启动。  
> 注意：生产环境，~~socket.io~~RabbitMQ 和 web 和 MongoDB 所在服务器应该有固定公网IP。  
> 注意：开发环境，可以把所有子包都部署在同一服务器上，有访问公网的权限即可，不必有公网IP.  

> Windows 各种安装包镜像:  
> https://trip.feishu.cn/docs/doccnHqaEoNo48vzqyWqgkxkm1s  

> 在 [packages/vendor-scripts-n-configs/other_tools/](packages/vendor-scripts-n-configs/other_tools/) 可以找到几个bat脚本，可以启动/停止 mongodb/rabbitmq 的服务.  
**用GBK / ANSI / GB2312编码**打开，否则会乱码。  
如果安装时修改了默认的路径或服务名，可以打开对应的文件，修改里面的路径。  


## ports (for dev)
Next.js 3002 ( will be on 80 / 443 in production, someday)  
Static HTML 3001 on production. (maybe, or just use Next.js )  
~~socket.io server 3003~~ 

## Run and Stop in Local / 本地，跑起来与停止  
```bash  
# inside project root folder
# without pm2
npm install && npm run dev  
# or with pm2
npm install && npm start
# if you are linux root, use below command to install 
# adduser someusername
# su -l someusername
# npm i

```  
You need to quit manually because we used `pm2`  
需要手动退出，因为用了`pm2`:  
```
npm stop
```  

## postinstall  
we executed bellow commands in postinstall:  
> installed pm2 and pm2-logrotate  

> `git update-index --skip-worktree packages/helper/globalConfig.prod.mjs`    

and after installed `packages/helper`, we will generate a keypair for jwt use.  

## production  
Modify `packages\helper\globalConfig.prod.mjs`  
( mongodb / rabbitmq / dynJSPath / nodemailer )  
and  `packages\web\.env.production`  
(nextHost / i18nDebug / mongodb)  

## other running notes  
[**\*\*packages/vendor-scripts-n-configs/README.md\*\***](packages/vendor-scripts-n-configs/README.md)  
[**\*\*packages/web/README.md\*\***](packages/web/README.md)  
[**\*\*packages/worker-scheduler/README.md\*\***](packages/worker-scheduler/README.md)  
[packages/helper/README.md](packages/helper/README.md)  
[packages/esm-loader/README.md](packages/esm-loader/README.md)

## License / 许可协议  
see [LICENSE.md](./LICENSE.md)  

##### Other Notes  
> https://daniel-gehuan-liu.notion.site/Web-Page-Monitor-b5910402c741496ea46cecd1a055eb25  
> https://www.wolai.com/ahuan/xvh7PRocdkApx5p9rTmrDc  
> https://github.com/lgh06/web-page-monitor/projects/1  

> Data flow chart  
> ![Data flow chart](https://alyjbedhbo.cdn.bspapp.com/ALYJBEDHBO-1f8d8dcb-ff67-4778-8209-da5ceecdd68f/91104d1f-c14f-48af-8276-35acc5b488d7.svg)



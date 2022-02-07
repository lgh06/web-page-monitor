## 更新日期  
2022年2月  

## Windows上的工具准备  
我个人目前使用windows操作系统。  
推荐使用putty 和 winscp连接服务器。  
[putty link 1](https://www.putty.org/) 
[putty link 2](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)  
[winscp link 1](https://winscp.net/eng/download.php) 
[winscp link 2](https://sourceforge.net/projects/winscp/files/WinSCP/5.19.5/)  

## Ubuntu (or other linux)  
服务器环境为Ubuntu Server 20.04 LTS  
### NodeJS的安装
建议首先安装[nvm](https://github.com/nvm-sh/nvm)。由于github的访问并不稳定，可以通过jsdelivr.net的镜像来下载:  
```bash
# curl  
curl -o- https://cdn.jsdelivr.net/gh/nvm-sh/nvm@0.39.1/install.sh | bash  
# or wget  
wget -qO- https://cdn.jsdelivr.net/gh/nvm-sh/nvm@0.39.1/install.sh | bash
```  
然后再安装指定版本的NodeJS, nrm:  
```bash
NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node nvm install 16  
nvm use 16
nvm alias default 16
npm i nrm -g --registry=https://registry.npmmirror.com
nrm use taobao
```
> https://npmmirror.com/mirrors/node  https://npm.taobao.org/mirrors/node  https://cdn.npmmirror.com/binaries/node  均可  

### fail2ban的安装 （Ubuntu Server 可能会自带）  
https://help.ubuntu.com/community/Fail2ban  
https://www.fail2ban.org/wiki/index.php/MANUAL_0_8  
https://github.com/fail2ban/fail2ban/issues/1903  

### 如何su成为另外一个用户传文件  
https://winscp.net/eng/docs/faq_su#sudo  
https://daniel-gehuan-liu.notion.site/How-do-I-change-user-after-login-e-g-su-root-WinSCP-01b9aba7a28d4c8b9ca2751ac4ee402b  

### 安装docker  
> https://docs.docker.com/engine/install/ubuntu/  
http://mirrors.ustc.edu.cn/help/docker-ce.html  

> download.docker.com 替换为 mirrors.ustc.edu.cn/docker-ce  
mirrors.163.com/docker-ce  
mirrors.cloud.tencent.com/docker-ce  
mirrors.aliyun.com/docker-ce  
mirrors.tencentyun.com/docker-ce  （腾讯云内网）

> 以下是使用了腾讯云mirror的 安装docker的方法：

```bash
sudo apt-get update  

sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release  

curl -fsSL https://mirrors.cloud.tencent.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg  

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.cloud.tencent.com/docker-ce/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null  

sudo apt-get remove docker docker-engine docker.io containerd runc  
sudo apt-get update  
sudo apt-get install docker-ce docker-ce-cli containerd.io  
```  

### 安装docker-compose  
> https://github.com/docker/compose  
https://docs.docker.com/compose/cli-command#install-on-linux  
```
sudo curl -SL https://get.daocloud.io/docker/compose/releases/download/v2.2.3/docker-compose-`uname -s`-`uname -m` -o /usr/libexec/docker/cli-plugins/docker-compose  

sudo chmod +x /usr/libexec/docker/cli-plugins/docker-compose
```
> github.com = dn-dao-github-mirror.daocloud.io / get.daocloud.io / github.com.cnpmjs.org

### 配置国内docker hub源  
```
vi /etc/docker/daemon.json

{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://docker.mirrors.ustc.edu.cn/",
    "https://mirror.baidubce.com"
  ]
}


sudo systemctl restart docker

```

### 配置docker日志清理
https://docs.docker.com/config/containers/logging/configure/  

### docker教程
https://www.katacoda.com/courses/container-runtimes  
https://github.com/yeasy/docker_practice  
Dockerfile / Docker Compose / BuildKit  
https://vuepress.mirror.docker-practice.com/buildx/buildkit/  
https://docs.docker.com/language/nodejs/build-images/  
https://docs.docker.com/develop/develop-images/build_enhancements/  
手册  
https://docs.docker.com/engine/reference/builder/  
https://docs.docker.com/compose/compose-file/compose-file-v3/  
docker compose启动顺序  
https://docs.docker.com/compose/startup-order/  
Next.js Docker  
https://nextjs.org/docs/deployment#docker-image  
docker 非root用户  
https://docs.docker.com/engine/install/linux-postinstall/  


### RabbitMQ docker 3.9 management  
https://hub.docker.com/_/rabbitmq  
https://github.com/docker-library/rabbitmq/  


```bash
# start  REPLACE default guest user!!!!
see sub folder

#stop & delete
sudo docker stop some-rabbit  
sudo docker container rm some-rabbit  

```  

plugins dir for official RabbitMQ docker image:
`/opt/rabbitmq/plugins`  or  `/plugins`  
> why? see [here](https://github.com/docker-library/rabbitmq/blob/8ab90ef58bb4e768dfac69e87fa079f9053c4816/3.9/ubuntu/Dockerfile#L268)  

Exposed ports:
> EXPOSE 4369 5671 5672 15691 15692 25672 15671 15672  


### root权限  

腾讯云 Ubuntu Server 20.04 LTS， ubuntu用户：  
```bash
sudo -s  
# or
sudo su -root  
# or 
sudo su  
```

### MongoDB 用户名 密码 设置  
https://stackoverflow.com/questions/37423659/how-to-create-user-in-mongodb-with-docker-compose  
https://stackoverflow.com/a/70244418/5332156  
https://stackoverflow.com/questions/42912755/how-to-create-a-db-for-mongodb-container-on-start-up  
https://stackoverflow.com/a/54064268/5332156  

### MongoDB conn string & authSource
https://docs.mongodb.com/v5.0/reference/connection-string/#components  
https://docs.mongodb.com/v5.0/reference/connection-string/#authentication-options  
https://docs.mongodb.com/v5.0/reference/system-users-collection/#system.users-collection  

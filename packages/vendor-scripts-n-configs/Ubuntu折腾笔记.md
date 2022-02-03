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
> https://npmmirror.com/mirrors/node/  https://npm.taobao.org/mirrors/node  均可

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

> 也可使用 mirrors.ustc.edu.cn/docker-ce  
mirrors.163.com/docker-ce  
mirrors.cloud.tencent.com/docker-ce  
mirrors.aliyun.com/docker-ce  

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
  "https://docker.mirrors.ustc.edu.cn/"
]
}


sudo systemctl restart docker

```

### docker教程
https://www.katacoda.com/courses/container-runtimes  
https://github.com/yeasy/docker_practice  
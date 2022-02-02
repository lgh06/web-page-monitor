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




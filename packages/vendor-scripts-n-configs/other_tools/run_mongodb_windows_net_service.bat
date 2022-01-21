rem Open this file in ANSI / GBK / GB2312 encoding.
@rem Mongodb官网上的windows版本安装包，默认为网络服务
@rem 若没有运行，执行此脚本可以运行mongdodb的网络服务
%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c %~s0 ::","","runas",1)(window.close)&&exit
net start mongodb
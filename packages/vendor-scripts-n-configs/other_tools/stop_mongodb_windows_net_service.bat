rem Open this file in ANSI / GBK / GB2312 encoding.
%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c %~s0 ::","","runas",1)(window.close)&&exit
net stop mongodb
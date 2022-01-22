rem Open this file in ANSI / GBK / GB2312 encoding.
%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c %~s0 ::","","runas",1)(window.close)&&exit
cd /d "C:\Program Files\RabbitMQ Server\rabbitmq_server-3.9.13\sbin"
"./rabbitmq-service.bat" start
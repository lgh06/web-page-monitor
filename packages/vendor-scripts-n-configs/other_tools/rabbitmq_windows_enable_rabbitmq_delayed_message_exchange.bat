rem !!! make sure you already downloaded the rabbitmq_delayed_message_exchange-3.9.x.ez file to RabbitMQ 's plugins folder!!!.
%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c %~s0 ::","","runas",1)(window.close)&&exit
cd /d "C:\Program Files\RabbitMQ Server\rabbitmq_server-3.9.13\sbin"
"./rabbitmq-plugins.bat" enable rabbitmq_delayed_message_exchange
## useful scripts & configs for rabbitmq & mongodb  
This folder not contain any JS codes.  
As this project depend on RabbitMQ and MongoDB, this folder contains some bat scripts and configs examples and help notes.  

### enable RabbitMQ Delayed Message Plugin  
- [RabbitMQ Delayed Message Plugin](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases)  
- [install help](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/tree/3.9.0#installation)  
- [blog](https://blog.rabbitmq.com/posts/2015/04/scheduling-messages-with-rabbitmq)  
- [how to enable 3rd party plugins](https://www.rabbitmq.com/installing-plugins.html) / [github mirror](https://github.com/rabbitmq/rabbitmq-website/blob/66c4d8a9123e9e7a4f785b485e2b9834e572956d/site/installing-plugins.md)  
> In a word, download a .ez file to RabbitMQ's plugins dir, then excecute a command in cmd to enable that.  see bat located in `other_tools`  

### enable RabbitMQ Web MQTT plugin  
- https://www.rabbitmq.com/web-mqtt.html / [github mirror](https://github.com/rabbitmq/rabbitmq-website/blob/66c4d8a9123e9e7a4f785b485e2b9834e572956d/site/web-mqtt.md)  
- [github web-mqtt-examples](https://github.com/rabbitmq/rabbitmq-server/tree/v3.9.x/deps/rabbitmq_web_mqtt_examples)  
- [paho mqtt js in rabbitmq official example](https://github.com/eclipse/paho.mqtt.javascript/blob/master/src/paho-mqtt.js)  
- [another mqtt.js supports websocket](https://github.com/mqttjs/MQTT.js)  
> in a word, that's RabbitMQ's builtin plugin,
just execute one command in cmd, that's done.  see bat located in `other_tools`  

### modify RabbitMQ's TTL & expires for messages  
https://www.rabbitmq.com/ttl.html#message-ttl-using-policy  
```
// messages auto expires after 24 hours
// for windows
cd /d "C:\Program Files\RabbitMQ Server\rabbitmq_server-3.9.13\sbin"
rabbitmqctl set_policy TTL ".*" "{""message-ttl"":86400000}" --apply-to queues
```  
> in a word, RabbitMQ do not have a default ttl / expire time set. you have to modify this.  

### modify RabbitMQ's Delivery Acknowledgement Timeout  
https://www.rabbitmq.com/consumers.html#acknowledgement-timeout  
in `rabbitmq.conf`, add  
```  
consumer_timeout = 1800000  
```  


### for RabbitMQ config file location:    
RabbitMQ [official doc](https://www.rabbitmq.com/configure.html) , [github mirror](https://github.com/rabbitmq/rabbitmq-website/blob/66c4d8a9123e9e7a4f785b485e2b9834e572956d/site/) for configs.  
Example RabbitMQ configs located at [github](https://github.com/rabbitmq/rabbitmq-server/tree/v3.9.x/deps/rabbit/docs)  
> In a word, create `rabbitmq.conf` or `advanced.config`,  
in Windows	`%APPDATA%\RabbitMQ\`;  
in Linux `/etc/rabbitmq/`;  
in Mac OS `${install_prefix}/etc/rabbitmq/`, ( homebrew's `${install_prefix}` should be  `/usr/local`).  

## for MongoDB & RabbitMQ security in production    
> https://github.com/lgh06/web-page-monitor/issues/15  (auth and safety)  
> https://github.com/lgh06/web-page-monitor/issues/16  (production configs)  



## useful scripts & configs for rabbitmq & mongodb  
This folder not contain any JS codes.  
As this project depend on RabbitMQ and MongoDB, this folder contains some bat scripts and configs examples and help notes.  

### enable RabbitMQ Delayed Message Plugin  
- [RabbitMQ Delayed Message Plugin](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases)  
- [install help](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/tree/3.9.0#installation)  
- [blog](https://blog.rabbitmq.com/posts/2015/04/scheduling-messages-with-rabbitmq)  
- [how to enable 3rd party plugins](https://www.rabbitmq.com/installing-plugins.html) / [github mirror](https://github.com/rabbitmq/rabbitmq-website/blob/66c4d8a9123e9e7a4f785b485e2b9834e572956d/site/installing-plugins.md)  

### enable RabbitMQ Web MQTT plugin  
- https://www.rabbitmq.com/web-mqtt.html / [github mirror](https://github.com/rabbitmq/rabbitmq-website/blob/66c4d8a9123e9e7a4f785b485e2b9834e572956d/site/web-mqtt.md)  
- [github web-mqtt-examples](https://github.com/rabbitmq/rabbitmq-server/tree/v3.9.x/deps/rabbitmq_web_mqtt_examples)  
- [paho mqtt js in rabbitmq official example](https://github.com/eclipse/paho.mqtt.javascript/blob/master/src/paho-mqtt.js)  
- [another mqtt.js supports websocket](https://github.com/mqttjs/MQTT.js)  

### for RabbitMQ Configs  
RabbitMQ [official doc](https://www.rabbitmq.com/configure.html) , [github mirror](https://github.com/rabbitmq/rabbitmq-website/blob/66c4d8a9123e9e7a4f785b485e2b9834e572956d/site/) for configs.  
Example RabbitMQ configs located at [github](https://github.com/rabbitmq/rabbitmq-server/tree/v3.9.x/deps/rabbit/docs)  
> In a word, create `rabbitmq.conf` or `advanced.config`,  
in Windows	`%APPDATA%\RabbitMQ\`;  
in Linux `/etc/rabbitmq/`;  
in Mac OS `${install_prefix}/etc/rabbitmq/`, ( homebrew's `${install_prefix}` should be  `/usr/local`).  

## for MongoDB & RabbitMQ security in production    
> https://github.com/lgh06/web-page-monitor/issues/15  



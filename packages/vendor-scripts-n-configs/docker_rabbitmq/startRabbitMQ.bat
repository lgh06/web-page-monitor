docker volume create rabbitvolumedata  
docker volume create rabbitvolumeconfig  
docker run -d --hostname my-host --name some-rabbit  -p 15672:15672 -p 5672:5672 -e RABBITMQ_DEFAULT_USER=guest -e RABBITMQ_DEFAULT_PASS=guest --log-driver local -v rabbitvolumedata:/var/lib/rabbitmq -v rabbitvolumeconfig:/etc/rabbitmq --restart=always ccr.ccs.tencentyun.com/lgh06/rabbitmq-delayed:0.0.2
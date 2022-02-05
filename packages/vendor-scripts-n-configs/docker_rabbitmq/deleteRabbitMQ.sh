#!/bin/bash
sudo docker stop some-rabbit
sudo docker rm some-rabbit
sudo docker image rm ccr.ccs.tencentyun.com/lgh06/rabbitmq-delayed:0.0.2
sudo docker volume rm rabbitvolumedata rabbitvolumeconfig
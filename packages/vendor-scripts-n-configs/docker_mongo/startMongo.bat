docker volume create mongovolume  
@rem https://docs.mongodb.com/v5.0/reference/program/mongod/#std-option-mongod.--bind_ip
docker run -d --hostname my-host --name some-mongo -p 10691:27017 --log-driver local -v mongovolume:/data/db --restart=always mongo:5-focal --bind_ip "::,0.0.0.0"
caddy_container_id=$(docker ps | grep caddy | awk '{print $1;}')
docker exec -w /etc/caddy $caddy_container_id caddy reload
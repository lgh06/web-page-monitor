@rem local dev use
docker volume create keycloakvolume
docker run -e KEYCLOAK_USER=user -e KEYCLOAK_PASSWORD=passwd --log-driver local -v keycloakvolume:/opt/jboss -p 10691:8080 -d --restart=always jboss/keycloak
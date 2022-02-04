@rem local dev use
@rem https://github.com/keycloak/keycloak-containers/blob/main/server/README.md
docker volume create keycloakvolume
docker run -e KEYCLOAK_USER=user -e KEYCLOAK_PASSWORD=passwd --log-driver local -v keycloakvolume:/opt/jboss -p 10691:8080 -d --restart=always jboss/keycloak
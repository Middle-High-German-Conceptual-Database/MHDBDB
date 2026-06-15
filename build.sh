#!/bin/bash

sdk use java 21.0.9-tem

cd backend
mvn clean install
cd ..
docker compose stop && docker compose build && docker compose up -d
# for connecting to the DHInfra sparql endpoint:
# docker compose stop && docker compose build && docker compose --env-file docker-compose-dhinfra.env up -d


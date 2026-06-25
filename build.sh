#!/bin/bash

# this builds and deploys the MHDBDB backend.
# The SPARQL endpoint (local or dhInfra) is picked according to the uncommented docker compose line below

sdk use java 21.0.9-tem

cd backend
mvn clean install
cd ..
# for original GraphDB on the host:
# docker compose stop && docker compose build && docker compose up -d
# for connecting to the DHInfra sparql endpoint:
docker compose stop && docker compose build && docker compose --env-file docker-compose-dhinfra.env up -d

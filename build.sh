#!/bin/sh

sdk use java 17.0.8.1-tem

cd backend
mvn clean install
cd ..
docker-compose stop && docker-compose build && docker-compose up -d


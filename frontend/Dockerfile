FROM node:12

WORKDIR /usr/src/app/app-ui

COPY package*.json ./

RUN npm install -g @angular/cli @angular-devkit/build-angular && npm install --force

EXPOSE 9000

CMD ["npm", "run", "start-docker"]

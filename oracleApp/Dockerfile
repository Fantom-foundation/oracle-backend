FROM node:10.5

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9991
CMD [ "node" "./bin/www" ]
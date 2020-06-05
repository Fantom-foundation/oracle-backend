FROM node:10.5

WORKDIR /usr/src/app

COPY testDataSource .

RUN npm install

EXPOSE 9991
CMD [ "node", "./bin/www" ]
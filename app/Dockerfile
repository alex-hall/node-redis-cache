FROM node:10.8.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
COPY .yarnrc ./

RUN yarn install

COPY . . 

EXPOSE 8080

CMD ["yarn", "test", "--verbose"]
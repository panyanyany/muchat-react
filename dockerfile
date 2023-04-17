FROM node:19-alpine as builder

COPY . /app

WORKDIR /app

RUN yarn

EXPOSE 3000

CMD yarn start

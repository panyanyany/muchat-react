FROM node:19-alpine as builder

COPY . /app

WORKDIR /app

RUN yarn

RUN sh ./dk_init.sh && yarn build

FROM nginx:1.23.4-alpine

COPY --from=builder /app/build /app/build

COPY docker/docker-entrypoint.sh /app/docker/docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh


EXPOSE 3000

CMD ["/app/docker/docker-entrypoint.sh"]
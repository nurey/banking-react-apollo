# syntax=docker/dockerfile:1
FROM node:krypton-alpine3.23 AS builder
WORKDIR /home/node/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM nginx:1.29.5-alpine3.23 AS server
COPY --from=builder /home/node/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

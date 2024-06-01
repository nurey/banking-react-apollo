# syntax=docker/dockerfile:1
FROM node:lts-alpine3.19 as builder
WORKDIR /home/node/app
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:1.25.5-alpine3.19 as server
COPY --from=builder /home/node/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

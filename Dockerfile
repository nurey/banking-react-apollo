# syntax=docker/dockerfile:1
FROM oven/bun:alpine AS builder
WORKDIR /home/bun/app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:1.29.7-alpine3.23 AS server
COPY --from=builder /home/bun/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# syntax=docker/dockerfile:1
FROM node:24-alpine AS builder
RUN npm install -g bun
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
RUN npx vite build

FROM nginx:stable-alpine-slim AS server
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

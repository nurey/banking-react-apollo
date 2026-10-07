# syntax=docker/dockerfile:1
FROM node:24-alpine AS builder
RUN npm install -g bun && apk add --no-cache brotli
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
RUN npx vite build
# Pre-compress text assets once at max levels; nginx serves these copies
# (brotli_static / gzip_static) instead of compressing on every request.
RUN find dist -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' -o -name '*.svg' -o -name '*.json' \) \
      -exec gzip -9 -k {} \; -exec brotli -q 11 -k {} \;

# Alpine's nginx, because the official nginx image has no Brotli module.
FROM alpine:3.24 AS server
RUN apk add --no-cache nginx nginx-mod-http-brotli \
 && ln -sf /dev/stdout /var/log/nginx/access.log \
 && ln -sf /dev/stderr /var/log/nginx/error.log
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/http.d/default.conf
EXPOSE 80
STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]

FROM node:21.7.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

ARG ci_build

RUN mkdir -p /app/log

RUN npm run build:${ci_build}

FROM nginx:stable-alpine

COPY --from=builder /app/build /usr/share/nginx/html

# Create nginx config directly instead of copying
RUN > /etc/nginx/conf.d/default.conf && \
    cat <<EOL > /etc/nginx/conf.d/default.conf
server {
  root /usr/share/nginx/html/;
  server_tokens off;
  client_max_body_size 200m;
  gzip             on;
  gzip_comp_level  6;
  gzip_min_length  1000;
  gzip_proxied     expired no-cache no-store private auth;
  gzip_types       text/plain application/x-javascript text/xml text/css application/xml text/javascript application/javascript application/json application/font-woff application/font-woff2 application/vnd.ms-fontobject application/x-font-ttf font/opentype;

  location / {
    try_files \$uri \$uri/ /index.html;
  }
}
EOL
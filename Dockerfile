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

COPY nginx.conf /etc/nginx/conf.d/default.conf
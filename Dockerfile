FROM node:21.7.0-alpine 

WORKDIR /usr/src/app

#COPY . .
COPY package*.json ./
RUN npm install 
COPY . .

ARG ci_build
# ENV ci_build $ci_build 

RUN mkdir -p /app/log

#CMD npm run ${ci_build}
RUN npm run build:${ci_build}

CMD npm start

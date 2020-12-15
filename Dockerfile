FROM node:8-alpine

RUN apk --no-cache add git

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

ENV PORT 3000
EXPOSE 3000

CMD [ "npm", "start" ]
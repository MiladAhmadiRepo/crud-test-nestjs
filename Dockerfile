FROM node:20-alpine

RUN mkdir crud-code
WORKDIR /crud-code
COPY ./package.json ./package.json

RUN npm install 
COPY . .

RUN npm run build
COPY ./env ./dist/env
WORKDIR /crud-code/dist/src
CMD node main.js
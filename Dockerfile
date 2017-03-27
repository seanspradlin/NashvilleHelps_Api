FROM node:onbuild

RUN npm install
RUN npm run docs

EXPOSE 8080


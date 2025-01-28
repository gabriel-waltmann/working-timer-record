FROM node:alpine

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm install pm2 -g

COPY . .

RUN rm -rf node_modules && npm install

EXPOSE 8081

RUN npm run build

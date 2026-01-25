FROM node:25-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY confirmservice.js .

CMD ["node", "confirmservice.js"]
FROM node:25-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY paymentservice.js .

EXPOSE 3001

CMD ["npm", "start"]
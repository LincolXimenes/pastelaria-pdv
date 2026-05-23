FROM node:24-alpine

WORKDIR /api_pastelaria

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]

EXPOSE 5000
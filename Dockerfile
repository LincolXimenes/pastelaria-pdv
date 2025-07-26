FROM node:latest

WORKDIR /api_pastelaria

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]

EXPOSE 5000
ENV PORT=5000
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY data_scripts.js ./

CMD ["npm", "run", "seed"]

FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

RUN npx typeorm migration:run -d dist/database/data-source.js
RUN npx typeorm schema:sync -d dist/database/data-source.js 
RUN npm run start:dev
FROM node:slim

WORKDIR /app

RUN apt-get update && apt-get upgrade openssl -y

COPY prisma ./prisma/

COPY package.json .
COPY package-lock.json .

RUN npm install

RUN npx prisma generate

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]

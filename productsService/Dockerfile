FROM node:20-alpine3.18

WORKDIR /app

COPY prisma ./prisma/

COPY package.json .
COPY package-lock.json .

RUN npm install

# RUN npx prisma db pull && npx prisma generate

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]

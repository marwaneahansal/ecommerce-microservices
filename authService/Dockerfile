FROM node:20-alpine3.18

WORKDIR /app

COPY prisma ./prisma/

COPY package.json .
COPY package-lock.json .

RUN npm install

RUN npx prisma generate

COPY . .

EXPOSE 3001

ENTRYPOINT [ "./entrypoint.sh" ]

CMD ["npm", "run", "dev"]

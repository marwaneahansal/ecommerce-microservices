FROM node:20-alpine3.18

WORKDIR /app

COPY prisma ./prisma/

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 3002

ENTRYPOINT [ "./entrypoint.sh" ]

CMD ["npm", "run", "dev"]

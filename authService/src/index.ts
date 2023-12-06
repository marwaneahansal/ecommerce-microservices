import { Request, Response } from "express";
import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

env.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice1@prisma.io',
      password: '123456789',
    },
  })
  res.json({ message: 'Hello World', data: user });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('Listening on port: ' +  PORT);
});
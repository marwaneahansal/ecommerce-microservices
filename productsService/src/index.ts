import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import { PrismaClient } from '@prisma/client';

env.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users).status(200);
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log('Listening on port: ' +  PORT);
});



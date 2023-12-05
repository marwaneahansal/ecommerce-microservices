import { Request, Response } from "express";
import express from 'express';
import cors from 'cors';
import env from 'dotenv';

env.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Auth Service!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('Listening on port: ' +  PORT);
});
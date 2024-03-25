import { Request, Response } from "express";
import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';
import env from 'dotenv';

env.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', proxy('http://auth:3001'));
app.use('/products', proxy('http://products:3002'));
app.use('/orders', proxy('http://orders:3003'));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
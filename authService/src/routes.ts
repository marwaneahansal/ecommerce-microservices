import { Prisma } from '@prisma/client';
import express, { Request, Response } from 'express';
import { registerUser, loginUser } from './controllers/auth.controller';

const router = express.Router();


router.get('/', (req, res) => {
  res.json({ message: 'Hello World from auth' });
});

router.post('/register', registerUser);
router.post('/login', loginUser);


export { router };
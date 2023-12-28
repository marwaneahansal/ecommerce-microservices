import express from 'express';
import { registerUser, loginUser, refreshToken } from './controllers/auth.controller';
import { authenticate } from './middlewares/authenticate.middleware';

const router = express.Router();


router.get('/', (req, res) => {
  res.json({ message: 'Hello World from auth' });
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);

router.get('/me',  authenticate, (req, res) => {
  res.json(req.currentUser);
});


export { router };
import { Router } from 'express';
import { login, refreshToken, setPassword, getMe, logout } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/set-password', setPassword);
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;

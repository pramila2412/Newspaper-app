import { Router } from 'express';
import { subscribe, unsubscribe, listSubscribers } from '../controllers/subscriber.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

// Public
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin
router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN), listSubscribers);

export default router;

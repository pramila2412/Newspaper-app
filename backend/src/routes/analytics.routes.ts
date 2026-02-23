import { Router } from 'express';
import { getDashboardStats, getArticleAnalytics } from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.SUPER_ADMIN, UserRole.EDITOR));

router.get('/dashboard', getDashboardStats);
router.get('/articles', getArticleAnalytics);

export default router;

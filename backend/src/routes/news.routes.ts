import { Router } from 'express';
import {
    createNews, updateNews, deleteNews, getNewsList, getNewsById,
    getPublicNews, getPublicNewsBySlug, getPublicNewsByCategory,
} from '../controllers/news.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

// Public
router.get('/public', getPublicNews);
router.get('/public/slug/:slug', getPublicNewsBySlug);
router.get('/public/category/:categoryId', getPublicNewsByCategory);

// Protected (Editor + Super Admin)
router.use(authenticate);
router.use(authorize(UserRole.SUPER_ADMIN, UserRole.EDITOR));

router.get('/', getNewsList);
router.get('/:id', getNewsById);
router.post('/', createNews);
router.patch('/:id', updateNews);
router.delete('/:id', deleteNews);

export default router;

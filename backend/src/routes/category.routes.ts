import { Router } from 'express';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../controllers/category.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

// Public
router.get('/', getCategories);

// Protected
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN), createCategory);
router.patch('/:id', authenticate, authorize(UserRole.SUPER_ADMIN), updateCategory);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN), deleteCategory);

export default router;

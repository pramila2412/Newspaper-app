import { Router } from 'express';
import { createClassified, listClassifieds, updateClassified, deleteClassified, publicListClassifieds } from '../controllers/classified.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

// Public
router.get('/public', publicListClassifieds);

// Admin
router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.EDITOR), listClassifieds);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.EDITOR), createClassified);
router.patch('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.EDITOR), updateClassified);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.EDITOR), deleteClassified);

export default router;

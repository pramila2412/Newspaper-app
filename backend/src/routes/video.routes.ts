import { Router } from 'express';
import { createVideo, listVideos, updateVideo, deleteVideo, publicListVideos } from '../controllers/video.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

// Public
router.get('/public', publicListVideos);

// Admin
router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.EDITOR), listVideos);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.EDITOR), createVideo);
router.patch('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.EDITOR), updateVideo);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.EDITOR), deleteVideo);

export default router;

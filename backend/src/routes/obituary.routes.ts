import { Router } from 'express';
import { createObituary, updateObituary, deleteObituary, listObituaries, getPublicObituaries } from '../controllers/obituary.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

// Public
router.get('/public', getPublicObituaries);

// Protected
router.use(authenticate);
router.use(authorize(UserRole.SUPER_ADMIN, UserRole.EDITOR));

router.get('/', listObituaries);
router.post('/', createObituary);
router.patch('/:id', updateObituary);
router.delete('/:id', deleteObituary);

export default router;

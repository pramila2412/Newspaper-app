import { Router } from 'express';
import { createMatrimony, updateMatrimony, deleteMatrimony, listMatrimony, getPublicMatrimony } from '../controllers/matrimony.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

// Public
router.get('/public', getPublicMatrimony);

// Protected
router.use(authenticate);
router.use(authorize(UserRole.SUPER_ADMIN, UserRole.EDITOR));

router.get('/', listMatrimony);
router.post('/', createMatrimony);
router.patch('/:id', updateMatrimony);
router.delete('/:id', deleteMatrimony);

export default router;

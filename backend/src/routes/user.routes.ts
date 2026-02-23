import { Router } from 'express';
import { createEditor, activateEditor, deactivateEditor, deleteEditor, listUsers } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.SUPER_ADMIN));

router.get('/', listUsers);
router.post('/', createEditor);
router.patch('/:id/activate', activateEditor);
router.patch('/:id/deactivate', deactivateEditor);
router.delete('/:id', deleteEditor);

export default router;

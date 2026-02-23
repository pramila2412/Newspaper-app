import { Router } from 'express';
import { uploadMedia, listMedia, deleteMedia, getMediaById } from '../controllers/media.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { upload } from '../middlewares/upload';
import { UserRole } from '../models/User';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.SUPER_ADMIN, UserRole.EDITOR));

router.post('/upload', upload.single('file'), uploadMedia);
router.get('/', listMedia);
router.get('/:id', getMediaById);
router.delete('/:id', deleteMedia);

export default router;

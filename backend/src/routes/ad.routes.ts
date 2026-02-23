import { Router } from 'express';
import {
    createAdset, listAdsets, deleteAdset,
    createAd, updateAd, deleteAd, listAds,
    getPublicAds, trackAdClick,
} from '../controllers/ad.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

// Public
router.get('/public', getPublicAds);
router.post('/:id/click', trackAdClick);

// Protected
router.use(authenticate);
router.use(authorize(UserRole.SUPER_ADMIN, UserRole.EDITOR));

// Adsets
router.get('/adsets', listAdsets);
router.post('/adsets', createAdset);
router.delete('/adsets/:id', deleteAdset);

// Ads
router.get('/', listAds);
router.post('/', createAd);
router.patch('/:id', updateAd);
router.delete('/:id', deleteAd);

export default router;

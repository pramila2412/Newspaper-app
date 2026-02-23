import { Router } from 'express';
import { createPrayerRequest, listPrayerRequests, approvePrayerRequest, deletePrayerRequest, publicListPrayerRequests, submitPrayerRequest } from '../controllers/prayer.controller';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

// Public
router.get('/public', publicListPrayerRequests);
router.post('/submit', submitPrayerRequest);

// Admin
router.get('/', authenticate, authorize(UserRole.SUPER_ADMIN), listPrayerRequests);
router.post('/', authenticate, authorize(UserRole.SUPER_ADMIN), createPrayerRequest);
router.patch('/:id/approve', authenticate, authorize(UserRole.SUPER_ADMIN), approvePrayerRequest);
router.delete('/:id', authenticate, authorize(UserRole.SUPER_ADMIN), deletePrayerRequest);

export default router;

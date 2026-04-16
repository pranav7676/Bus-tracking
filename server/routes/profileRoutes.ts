import { Router } from 'express';
import { getProfile, createProfile, updateProfile } from '../controllers/profileController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, getProfile);
router.post('/', authMiddleware, createProfile);
router.put('/', authMiddleware, updateProfile);

export default router;

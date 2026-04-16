import { Router } from 'express';
import { register, login, getMe, updateRole } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.patch('/me/role', authMiddleware, updateRole);

export default router;

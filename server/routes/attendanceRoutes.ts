import { Router } from 'express';
import { markAttendance, getAttendance } from '../controllers/attendanceController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, getAttendance);
router.post('/', authMiddleware, markAttendance);

export default router;

import { Router } from 'express';
import { createBus, getAllBuses, getBusById, updateBus, deleteBus } from '../controllers/busController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// To follow REST properly and restrict actions, but for simplicity we assume auth covers all.
// Realistically, Create/Update/Delete should check for ADMIN role.
router.get('/', authMiddleware, getAllBuses);
router.get('/:id', authMiddleware, getBusById);
router.post('/', authMiddleware, createBus);
router.put('/:id', authMiddleware, updateBus);
router.delete('/:id', authMiddleware, deleteBus);

export default router;

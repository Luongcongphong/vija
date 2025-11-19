import { Router } from 'express';
import { getAllQLKH, getQLKHById, createQLKH, updateQLKH, deleteQLKH } from '../controllers/qlkhController';
import { authMiddleware, requireSales } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);
router.use(requireSales); // Admin và Sales

router.get('/', getAllQLKH);
router.get('/:id', getQLKHById);
router.post('/', createQLKH);
router.put('/:id', updateQLKH);
router.delete('/:id', deleteQLKH);

export default router;

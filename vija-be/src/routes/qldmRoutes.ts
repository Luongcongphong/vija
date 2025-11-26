import { Router } from 'express';
import { getAllQLDM, getQLDMById, getAllMaBV, createQLDM, updateQLDM, deleteQLDM } from '../controllers/qldmController';
import { authMiddleware, requireSales } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);
router.use(requireSales); // Admin và Sales

router.get('/ma-bv', getAllMaBV); // Phải đặt trước /:id
router.get('/:id', getQLDMById);
router.get('/', getAllQLDM);
router.post('/', createQLDM);
router.put('/:id', updateQLDM);
router.delete('/:id', deleteQLDM);

export default router;

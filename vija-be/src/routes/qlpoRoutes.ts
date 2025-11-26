import { Router } from 'express';
import { getAllQLPO, getQLPOById, getQLPOByMaPO, getAllMaPO, createQLPO, updateQLPO, deleteQLPO } from '../controllers/qlpoController';
import { authMiddleware, requireKyThuat } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);
router.use(requireKyThuat); // Admin và Kỹ thuật

router.get('/ma-po', getAllMaPO);
router.get('/by-ma-po/:ma_po', getQLPOByMaPO);
router.get('/:id', getQLPOById);
router.get('/', getAllQLPO);
router.post('/', createQLPO);
router.put('/:id', updateQLPO);
router.delete('/:id', deleteQLPO);

export default router;

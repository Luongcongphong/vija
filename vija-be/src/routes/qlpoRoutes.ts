import { Router } from 'express';
import { getAllQLPO, getQLPOById, createQLPO, updateQLPO, deleteQLPO } from '../controllers/qlpoController';
import { authMiddleware, requireKyThuat } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);
router.use(requireKyThuat); // Admin và Kỹ thuật

router.get('/', getAllQLPO);
router.get('/:id', getQLPOById);
router.post('/', createQLPO);
router.put('/:id', updateQLPO);
router.delete('/:id', deleteQLPO);

export default router;

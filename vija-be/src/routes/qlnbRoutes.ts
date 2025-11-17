import { Router } from 'express';
import { getAllQLNB, getQLNBById, createQLNB, updateQLNB, deleteQLNB } from '../controllers/qlnbController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getAllQLNB);
router.get('/:id', getQLNBById);
router.post('/', createQLNB);
router.put('/:id', updateQLNB);
router.delete('/:id', deleteQLNB);

export default router;

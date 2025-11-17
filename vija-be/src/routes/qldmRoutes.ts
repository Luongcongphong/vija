import { Router } from 'express';
import { getAllQLDM, getQLDMById, createQLDM, updateQLDM, deleteQLDM } from '../controllers/qldmController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getAllQLDM);
router.get('/:id', getQLDMById);
router.post('/', createQLDM);
router.put('/:id', updateQLDM);
router.delete('/:id', deleteQLDM);

export default router;

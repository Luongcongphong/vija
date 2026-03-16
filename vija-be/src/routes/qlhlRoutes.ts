import express from 'express';
import {
  getAllQLHL,
  getQLHLById,
  getQLHLByQLPOId,
  createQLHL,
  updateQLHL,
  deleteQLHL
} from '../controllers/qlhlController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Tất cả các route đều cần authentication
router.use(authMiddleware);

// Các API endpoint cho QLHL
router.get('/', getAllQLHL);
router.get('/:id', getQLHLById);
router.get('/by-po/:qlpo_id', getQLHLByQLPOId);
router.post('/', createQLHL);
router.put('/:id', updateQLHL);
router.delete('/:id', deleteQLHL);

export default router;

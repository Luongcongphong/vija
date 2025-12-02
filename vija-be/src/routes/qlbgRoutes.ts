import express from 'express';
import { authMiddleware, requireSales } from '../middleware/auth';
import {
  getAllQLBG,
  getQLBGById,
  getQLBGBySoBG,
  getAllSoBG,
  getDonGia,
  createQLBG,
  updateQLBG,
  deleteQLBG,
  deleteQLBGBySoBG
} from '../controllers/qlbgController';

const router = express.Router();

// Tất cả routes cần authentication
router.use(authMiddleware);
router.use(requireSales); // Admin và Sales

// GET routes
router.get('/', getAllQLBG);
router.get('/so-bg', getAllSoBG);
router.get('/don-gia', getDonGia);
router.get('/by-so-bg/:so_bg', getQLBGBySoBG);
router.get('/:id', getQLBGById);

// POST routes
router.post('/', createQLBG);

// PUT routes
router.put('/:id', updateQLBG);

// DELETE routes
router.delete('/by-so-bg/:so_bg', deleteQLBGBySoBG);
router.delete('/:id', deleteQLBG);

export default router;

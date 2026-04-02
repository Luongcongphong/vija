import { Router } from 'express';
import { 
  getAllQLKHO, 
  nhapKho, 
  xuatKho,
  getLichSuNhap,
  getLichSuXuat
} from '../controllers/qlkhoController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Áp dụng middleware xác thực cho tất cả các route
router.use(authMiddleware);

router.get('/', getAllQLKHO);
router.get('/:ma_bv/nhap', getLichSuNhap);
router.get('/:ma_bv/xuat', getLichSuXuat);

router.post('/nhap', nhapKho);
router.post('/xuat', xuatKho);

export default router;

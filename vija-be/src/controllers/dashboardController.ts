import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const query = `
      SELECT 
        k.id,
        k.po,
        k.ma_bv,
        k.so_luong,
        k.don_gia,
        k.thanh_tien,
        COALESCE(n.phoi_lieu, 0) as phoi_lieu,
        COALESCE(n.gia_cong_ngoai, 0) as gia_cong_ngoai,
        COALESCE(n.gia_cong_noi_bo, 0) as gia_cong_noi_bo,
        COALESCE(n.xu_ly_be_mat, 0) as xu_ly_be_mat,
        COALESCE(n.van_chuyen, 0) as van_chuyen,
        COALESCE(n.phi_qldn, 0) as phi_qldn,
        COALESCE(n.tong_phi, 0) as tong_phi,
        (k.thanh_tien - COALESCE(n.tong_phi, 0)) as loi_nhuan,
        CASE 
          WHEN k.thanh_tien > 0 THEN ROUND(((k.thanh_tien - COALESCE(n.tong_phi, 0)) / k.thanh_tien * 100), 2)
          ELSE 0 
        END as ty_le,
        k.created_at as ngay_tao
      FROM qlkh k
      LEFT JOIN qlnb n ON k.po = n.po AND k.ma_bv = n.ma_bv
      ORDER BY k.created_at DESC
    `;

    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

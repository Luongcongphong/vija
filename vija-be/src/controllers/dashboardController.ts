import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const query = `
      SELECT 
        CONCAT(bg.id, '-', po.id) as id,
        bg.stt,
        bg.so_bg,
        po.ma_po,
        bg.ma_bv,
        bg.so_luong,
        bg.don_gia,
        bg.thanh_tien,
        COALESCE(nb.phoi_lieu, 0) as phoi_lieu,
        COALESCE(nb.gia_cong_ngoai, 0) as gia_cong_ngoai,
        COALESCE(nb.gia_cong_noi_bo, 0) as gia_cong_noi_bo,
        COALESCE(nb.xu_ly_be_mat, 0) as xu_ly_be_mat,
        COALESCE(nb.van_chuyen, 0) as van_chuyen,
        COALESCE(nb.phi_qldn, 0) as phi_qldn,
        COALESCE(nb.tong_phi, 0) as tong_phi,
        (bg.thanh_tien - COALESCE(nb.tong_phi, 0)) as loi_nhuan,
        CASE 
          WHEN bg.thanh_tien > 0 THEN 
            ROUND(((bg.thanh_tien - COALESCE(nb.tong_phi, 0)) / bg.thanh_tien * 100), 2)
          ELSE 0 
        END as ty_le,
        bg.created_at as ngay_tao
      FROM qlbg bg
      INNER JOIN qlpo po ON po.ma_bv = bg.ma_bv
      LEFT JOIN qlnb nb ON nb.ma_po = po.ma_po AND nb.ma_bv = bg.ma_bv
      ORDER BY 
        CAST(REGEXP_REPLACE(po.ma_po, '[^0-9]', '') AS UNSIGNED) ASC,
        po.ma_po ASC
    `;

    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error: any) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message,
      details: error.sqlMessage 
    });
  }
};

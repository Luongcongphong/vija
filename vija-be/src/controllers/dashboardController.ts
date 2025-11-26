import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const { so_bg } = req.query;
    
    let query = `
      SELECT 
        bg.id,
        bg.stt,
        bg.so_bg,
        (SELECT GROUP_CONCAT(DISTINCT po.ma_po) 
         FROM qlpo po 
         WHERE po.ma_bv = bg.ma_bv) as ma_po,
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
      LEFT JOIN qlnb nb ON bg.so_bg = nb.so_bg AND bg.ma_bv = nb.ma_bv
      WHERE EXISTS (
        SELECT 1 FROM qlpo po WHERE po.ma_bv = bg.ma_bv
      )
    `;
    
    // Filter by Số BG if provided
    if (so_bg) {
      query += ` AND bg.so_bg = ?`;
    }
    
    query += ` ORDER BY bg.stt DESC`;

    const [rows] = await pool.query(query, so_bg ? [so_bg] : []);
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

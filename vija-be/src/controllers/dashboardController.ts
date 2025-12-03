import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    // Debug: Kiểm tra dữ liệu QLDM
    const [qldmCheck]: any = await pool.query('SELECT COUNT(*) as count FROM qldm');
    console.log('=== DASHBOARD DEBUG ===');
    console.log('QLDM total rows:', qldmCheck[0].count);
    
    // Debug: Kiểm tra QLPO
    const [qlpoCheck]: any = await pool.query('SELECT COUNT(*) as count FROM qlpo');
    console.log('QLPO total rows:', qlpoCheck[0].count);
    
    // Debug: Kiểm tra JOIN
    const [joinCheck]: any = await pool.query(`
      SELECT 
        po.ma_bv as po_ma_bv,
        dm.ma_bv as dm_ma_bv,
        dm.don_gia
      FROM qlpo po
      LEFT JOIN qldm dm ON dm.ma_bv = po.ma_bv
      LIMIT 3
    `);
    console.log('JOIN check sample:', joinCheck);
    
    // Query chính - Lấy đơn giá theo ngưỡng số lượng
    // Logic: Tìm mức giá có so_luong nhỏ nhất mà >= số lượng PO
    // VD: QLDM có 50->23000, 100->10000
    //     PO có 30 -> lấy giá 23000 (ngưỡng 50, vì 30 <= 50)
    //     PO có 51 -> lấy giá 10000 (ngưỡng 100, vì 51 <= 100)
    //     PO có 150 -> lấy giá 10000 (ngưỡng 100, vì không có ngưỡng nào >= 150)
    const query = `
      SELECT 
        po.id as id,
        po.ma_po,
        po.ma_bv,
        po.so_luong,
        COALESCE(
          (SELECT don_gia 
           FROM qldm 
           WHERE ma_bv = po.ma_bv 
             AND so_luong >= po.so_luong
           ORDER BY so_luong ASC 
           LIMIT 1),
          (SELECT don_gia 
           FROM qldm 
           WHERE ma_bv = po.ma_bv
           ORDER BY so_luong DESC 
           LIMIT 1),
          0
        ) as don_gia,
        (po.so_luong * COALESCE(
          (SELECT don_gia 
           FROM qldm 
           WHERE ma_bv = po.ma_bv 
             AND so_luong >= po.so_luong
           ORDER BY so_luong ASC 
           LIMIT 1),
          (SELECT don_gia 
           FROM qldm 
           WHERE ma_bv = po.ma_bv
           ORDER BY so_luong DESC 
           LIMIT 1),
          0
        )) as thanh_tien,
        COALESCE(nb.phoi_lieu, 0) as phoi_lieu,
        COALESCE(nb.gia_cong_ngoai, 0) as gia_cong_ngoai,
        COALESCE(nb.gia_cong_noi_bo, 0) as gia_cong_noi_bo,
        COALESCE(nb.xu_ly_be_mat, 0) as xu_ly_be_mat,
        COALESCE(nb.van_chuyen, 0) as van_chuyen,
        COALESCE(nb.phi_qldn, 0) as phi_qldn,
        COALESCE(nb.tong_phi, 0) as tong_phi,
        ((po.so_luong * COALESCE(
          (SELECT don_gia 
           FROM qldm 
           WHERE ma_bv = po.ma_bv 
             AND so_luong >= po.so_luong
           ORDER BY so_luong ASC 
           LIMIT 1),
          (SELECT don_gia 
           FROM qldm 
           WHERE ma_bv = po.ma_bv
           ORDER BY so_luong DESC 
           LIMIT 1),
          0
        )) - COALESCE(nb.tong_phi, 0)) as loi_nhuan,
        CASE 
          WHEN (po.so_luong * COALESCE(
            (SELECT don_gia 
             FROM qldm 
             WHERE ma_bv = po.ma_bv 
               AND so_luong >= po.so_luong
             ORDER BY so_luong ASC 
             LIMIT 1),
            (SELECT don_gia 
             FROM qldm 
             WHERE ma_bv = po.ma_bv
             ORDER BY so_luong DESC 
             LIMIT 1),
            0
          )) > 0 THEN 
            ROUND((((po.so_luong * COALESCE(
              (SELECT don_gia 
               FROM qldm 
               WHERE ma_bv = po.ma_bv 
                 AND so_luong >= po.so_luong
               ORDER BY so_luong ASC 
               LIMIT 1),
              (SELECT don_gia 
               FROM qldm 
               WHERE ma_bv = po.ma_bv
               ORDER BY so_luong DESC 
               LIMIT 1),
              0
            )) - COALESCE(nb.tong_phi, 0)) / (po.so_luong * COALESCE(
              (SELECT don_gia 
               FROM qldm 
               WHERE ma_bv = po.ma_bv 
                 AND so_luong >= po.so_luong
               ORDER BY so_luong ASC 
               LIMIT 1),
              (SELECT don_gia 
               FROM qldm 
               WHERE ma_bv = po.ma_bv
               ORDER BY so_luong DESC 
               LIMIT 1),
              0
            )) * 100), 2)
          ELSE 0 
        END as ty_le,
        po.created_at as ngay_tao
      FROM qlpo po
      LEFT JOIN qlnb nb ON nb.ma_po = po.ma_po AND nb.ma_bv = po.ma_bv
      ORDER BY 
        CAST(REGEXP_REPLACE(po.ma_po, '[^0-9]', '') AS UNSIGNED) ASC,
        po.ma_po ASC
    `;

    const [rows] = await pool.query(query);
    
    console.log('Dashboard result count:', (rows as any[]).length);
    console.log('First row sample:', (rows as any[])[0]);
    console.log('======================');
    
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

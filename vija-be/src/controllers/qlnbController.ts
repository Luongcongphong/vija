import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllQLNB = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM qlnb ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const getQLNBById = async (req: AuthRequest, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM qlnb WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const createQLNB = async (req: AuthRequest, res: Response) => {
  try {
    const { po, ma_bv, phoi_lieu, gia_cong_ngoai, gia_cong_noi_bo, xu_ly_be_mat, van_chuyen, phi_qldn } = req.body;
    const tong_phi = phoi_lieu + gia_cong_ngoai + gia_cong_noi_bo + xu_ly_be_mat + van_chuyen + phi_qldn;

    const [result]: any = await pool.query(
      'INSERT INTO qlnb (po, ma_bv, phoi_lieu, gia_cong_ngoai, gia_cong_noi_bo, xu_ly_be_mat, van_chuyen, phi_qldn, tong_phi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [po, ma_bv, phoi_lieu, gia_cong_ngoai, gia_cong_noi_bo, xu_ly_be_mat, van_chuyen, phi_qldn, tong_phi]
    );

    res.status(201).json({
      message: 'Tạo thành công',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const updateQLNB = async (req: AuthRequest, res: Response) => {
  try {
    const { po, ma_bv, phoi_lieu, gia_cong_ngoai, gia_cong_noi_bo, xu_ly_be_mat, van_chuyen, phi_qldn } = req.body;
    const tong_phi = phoi_lieu + gia_cong_ngoai + gia_cong_noi_bo + xu_ly_be_mat + van_chuyen + phi_qldn;

    await pool.query(
      'UPDATE qlnb SET po = ?, ma_bv = ?, phoi_lieu = ?, gia_cong_ngoai = ?, gia_cong_noi_bo = ?, xu_ly_be_mat = ?, van_chuyen = ?, phi_qldn = ?, tong_phi = ? WHERE id = ?',
      [po, ma_bv, phoi_lieu, gia_cong_ngoai, gia_cong_noi_bo, xu_ly_be_mat, van_chuyen, phi_qldn, tong_phi, req.params.id]
    );

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const deleteQLNB = async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM qlnb WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

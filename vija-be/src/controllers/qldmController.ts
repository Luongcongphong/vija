import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllQLDM = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM qldm ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const getQLDMById = async (req: AuthRequest, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM qldm WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const createQLDM = async (req: AuthRequest, res: Response) => {
  try {
    const { po, ma_bv, so_luong, don_gia, dinh_muc } = req.body;

    const [result]: any = await pool.query(
      'INSERT INTO qldm (po, ma_bv, so_luong, don_gia, dinh_muc) VALUES (?, ?, ?, ?, ?)',
      [po, ma_bv, so_luong, don_gia, dinh_muc]
    );

    res.status(201).json({
      message: 'Tạo thành công',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const updateQLDM = async (req: AuthRequest, res: Response) => {
  try {
    const { po, ma_bv, so_luong, don_gia, dinh_muc } = req.body;

    await pool.query(
      'UPDATE qldm SET po = ?, ma_bv = ?, so_luong = ?, don_gia = ?, dinh_muc = ? WHERE id = ?',
      [po, ma_bv, so_luong, don_gia, dinh_muc, req.params.id]
    );

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const deleteQLDM = async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM qldm WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

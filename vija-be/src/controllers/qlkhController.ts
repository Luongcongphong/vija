import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { QLKH } from '../types';

export const getAllQLKH = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM qlkh ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const getQLKHById = async (req: AuthRequest, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM qlkh WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const createQLKH = async (req: AuthRequest, res: Response) => {
  try {
    const { po, ma_bv, so_luong, don_gia } = req.body;
    const thanh_tien = so_luong * don_gia;

    const [result]: any = await pool.query(
      'INSERT INTO qlkh (po, ma_bv, so_luong, don_gia, thanh_tien) VALUES (?, ?, ?, ?, ?)',
      [po, ma_bv, so_luong, don_gia, thanh_tien]
    );

    res.status(201).json({
      message: 'Tạo thành công',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const updateQLKH = async (req: AuthRequest, res: Response) => {
  try {
    const { po, ma_bv, so_luong, don_gia } = req.body;
    const thanh_tien = so_luong * don_gia;

    await pool.query(
      'UPDATE qlkh SET po = ?, ma_bv = ?, so_luong = ?, don_gia = ?, thanh_tien = ? WHERE id = ?',
      [po, ma_bv, so_luong, don_gia, thanh_tien, req.params.id]
    );

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const deleteQLKH = async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM qlkh WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

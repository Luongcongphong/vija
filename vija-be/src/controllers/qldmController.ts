import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Lấy tất cả định mức
export const getAllQLDM = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM qldm ORDER BY ma_bv, so_luong');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy định mức theo ID
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

// Lấy danh sách Mã BV (unique)
export const getAllMaBV = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT ma_bv FROM qldm ORDER BY ma_bv'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Tạo định mức mới
export const createQLDM = async (req: AuthRequest, res: Response) => {
  try {
    const { ma_bv, so_luong, don_gia } = req.body;

    const [result]: any = await pool.query(
      'INSERT INTO qldm (ma_bv, so_luong, don_gia) VALUES (?, ?, ?)',
      [ma_bv, so_luong, don_gia]
    );

    res.status(201).json({
      message: 'Tạo thành công',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Cập nhật định mức
export const updateQLDM = async (req: AuthRequest, res: Response) => {
  try {
    const { ma_bv, so_luong, don_gia } = req.body;

    await pool.query(
      'UPDATE qldm SET ma_bv = ?, so_luong = ?, don_gia = ? WHERE id = ?',
      [ma_bv, so_luong, don_gia, req.params.id]
    );

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Xóa định mức
export const deleteQLDM = async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM qldm WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

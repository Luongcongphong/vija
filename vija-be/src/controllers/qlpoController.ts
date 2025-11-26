import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Lấy tất cả PO
export const getAllQLPO = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM qlpo ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy PO theo ID
export const getQLPOById = async (req: AuthRequest, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM qlpo WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy tất cả PO theo Mã PO
export const getQLPOByMaPO = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM qlpo WHERE ma_po = ? ORDER BY created_at ASC',
      [req.params.ma_po]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy danh sách Mã PO (unique)
export const getAllMaPO = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT ma_po FROM qlpo ORDER BY ma_po DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Tạo PO mới
export const createQLPO = async (req: AuthRequest, res: Response) => {
  try {
    const { ma_po, ma_bv, ngay_tao, ngay_giao } = req.body;

    const [result]: any = await pool.query(
      'INSERT INTO qlpo (ma_po, ma_bv, ngay_tao, ngay_giao) VALUES (?, ?, ?, ?)',
      [ma_po, ma_bv, ngay_tao, ngay_giao]
    );

    res.status(201).json({
      message: 'Tạo thành công',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Cập nhật PO
export const updateQLPO = async (req: AuthRequest, res: Response) => {
  try {
    const { ma_po, ma_bv, ngay_tao, ngay_giao } = req.body;

    await pool.query(
      'UPDATE qlpo SET ma_po = ?, ma_bv = ?, ngay_tao = ?, ngay_giao = ? WHERE id = ?',
      [ma_po, ma_bv, ngay_tao, ngay_giao, req.params.id]
    );

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Xóa PO
export const deleteQLPO = async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM qlpo WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

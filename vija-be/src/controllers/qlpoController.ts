import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllQLPO = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM qlpo ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

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

export const createQLPO = async (req: AuthRequest, res: Response) => {
  try {
    const { po, ma_bv } = req.body;

    const [result]: any = await pool.query(
      'INSERT INTO qlpo (po, ma_bv) VALUES (?, ?)',
      [po, ma_bv]
    );

    res.status(201).json({
      message: 'Tạo thành công',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const updateQLPO = async (req: AuthRequest, res: Response) => {
  try {
    const { po, ma_bv } = req.body;

    await pool.query(
      'UPDATE qlpo SET po = ?, ma_bv = ? WHERE id = ?',
      [po, ma_bv, req.params.id]
    );

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const deleteQLPO = async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM qlpo WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

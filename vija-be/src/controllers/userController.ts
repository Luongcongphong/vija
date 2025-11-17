import { Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT id, username, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT id, username, created_at FROM users WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { username, password } = req.body;

    const [existing]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result]: any = await pool.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({
      message: 'Tạo thành công',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { username, password } = req.body;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE users SET username = ?, password = ? WHERE id = ?',
        [username, hashedPassword, req.params.id]
      );
    } else {
      await pool.query(
        'UPDATE users SET username = ? WHERE id = ?',
        [username, req.params.id]
      );
    }

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

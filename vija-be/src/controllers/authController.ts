import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { User } from '../types';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    const user: User = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'vija_secret_key_2024',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const register = async (req: Request, res: Response) => {
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
      message: 'Đăng ký thành công',
      userId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

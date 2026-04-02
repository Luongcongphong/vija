import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Lấy tất cả tồn kho
export const getAllQLKHO = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        d.id,
        d.ma_kh,
        d.ma_bv,
        d.dvt as don_vi,
        COALESCE(SUM(n.so_luong), 0) as tong_nhap,
        COALESCE(SUM(x.so_luong), 0) as tong_xuat
      FROM qldm d
      LEFT JOIN (
        SELECT ma_bv, SUM(so_luong) as so_luong FROM qlkho_nhap GROUP BY ma_bv
      ) n ON d.ma_bv = n.ma_bv
      LEFT JOIN (
        SELECT ma_bv, SUM(so_luong) as so_luong FROM qlkho_xuat GROUP BY ma_bv
      ) x ON d.ma_bv = x.ma_bv
      GROUP BY d.id, d.ma_kh, d.ma_bv, d.dvt
      ORDER BY d.ma_bv
    `);
    
    // Map dữ liệu theo công thức Nhập - Xuất
    const result = (rows as any[]).map(row => ({
      ...row,
      so_luong: row.tong_nhap - row.tong_xuat
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy lịch sử Nhập của một Mã BV
export const getLichSuNhap = async (req: AuthRequest, res: Response) => {
  try {
    const { ma_bv } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM qlkho_nhap WHERE ma_bv = ? ORDER BY ngay_nhap DESC, created_at DESC',
      [ma_bv]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy lịch sử Xuất của một Mã BV
export const getLichSuXuat = async (req: AuthRequest, res: Response) => {
  try {
    const { ma_bv } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM qlkho_xuat WHERE ma_bv = ? ORDER BY ngay_xuat DESC, created_at DESC',
      [ma_bv]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Nhập kho
export const nhapKho = async (req: AuthRequest, res: Response) => {
  try {
    const { ma_bv, ngay_nhap, so_luong } = req.body;

    if (!ma_bv || !ngay_nhap || !so_luong) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    // Convert date format from ISO to MySQL format (YYYY-MM-DD)
    const formatDate = (dateStr: string): string | null => {
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return null;
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
      } catch {
        return null;
      }
    };

    const formattedNgayNhap = formatDate(ngay_nhap);
    if (!formattedNgayNhap) {
      return res.status(400).json({ message: 'Ngày nhập không hợp lệ' });
    }

    const [result]: any = await pool.query(
      'INSERT INTO qlkho_nhap (ma_bv, ngay_nhap, so_luong) VALUES (?, ?, ?)',
      [ma_bv, formattedNgayNhap, Number(so_luong)]
    );

    res.status(201).json({
      message: 'Nhập kho thành công',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Xuất kho
export const xuatKho = async (req: AuthRequest, res: Response) => {
  try {
    const { ma_bv, ma_po, ngay_xuat, so_luong } = req.body;

    if (!ma_bv || !ngay_xuat || !so_luong) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    // Convert date format from ISO to MySQL format (YYYY-MM-DD)
    const formatDate = (dateStr: string): string | null => {
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return null;
        return date.toISOString().split('T')[0];
      } catch {
        return null;
      }
    };

    const formattedNgayXuat = formatDate(ngay_xuat);
    if (!formattedNgayXuat) {
      return res.status(400).json({ message: 'Ngày xuất không hợp lệ' });
    }

    const [result]: any = await pool.query(
      'INSERT INTO qlkho_xuat (ma_bv, ma_po, ngay_xuat, so_luong) VALUES (?, ?, ?, ?)',
      [ma_bv, ma_po || null, formattedNgayXuat, Number(so_luong)]
    );

    res.status(201).json({
      message: 'Xuất kho thành công',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

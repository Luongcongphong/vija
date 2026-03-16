import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Lấy tất cả QLHL
export const getAllQLHL = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM qlhl ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy QLHL theo ID
export const getQLHLById = async (req: AuthRequest, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM qlhl WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy QLHL theo qlpo_id
export const getQLHLByQLPOId = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM qlhl WHERE qlpo_id = ? ORDER BY created_at DESC',
      [req.params.qlpo_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Tạo QLHL mới
export const createQLHL = async (req: AuthRequest, res: Response) => {
  try {
    const { qlpo_id, sl, giao_bu, ngay_tra, ngay_giao_bu } = req.body;

    if (!qlpo_id) {
      return res.status(400).json({ message: 'qlpo_id là bắt buộc' });
    }

    // Lấy thông tin PO để populate các trường khác
    const [poRows]: any = await pool.query(
      `SELECT po.*, (SELECT dvt FROM qldm WHERE ma_bv = po.ma_bv LIMIT 1) as dvt 
       FROM qlpo po WHERE id = ?`,
      [qlpo_id]
    );

    if (poRows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy PO tương ứng' });
    }

    const { ma_po, ma_bv, ma_kh, dvt } = poRows[0];

    // Convert date format from ISO to MySQL format (YYYY-MM-DD)
    const formatDate = (dateStr: string | null | undefined): string | null => {
      if (!dateStr) return null;
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return null;
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
      } catch {
        return null;
      }
    };

    const formattedNgayTra = formatDate(ngay_tra);
    const formattedNgayGiaoBu = formatDate(ngay_giao_bu);
    const soLuong = Number(sl) || 0;
    const soLuongGiaoBu = Number(giao_bu) || 0;

    const [result]: any = await pool.query(
      `INSERT INTO qlhl 
      (qlpo_id, ma_po, ma_bv, ma_kh, dvt, sl, giao_bu, ngay_tra, ngay_giao_bu) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [qlpo_id, ma_po, ma_bv, ma_kh, dvt || 'Cái', soLuong, soLuongGiaoBu, formattedNgayTra, formattedNgayGiaoBu]
    );

    res.status(201).json({
      message: 'Tạo thành công',
      id: result.insertId
    });
  } catch (error: any) {
    console.error('Error creating QLHL:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Cập nhật QLHL
export const updateQLHL = async (req: AuthRequest, res: Response) => {
  try {
    const { sl, giao_bu, ngay_tra, ngay_giao_bu } = req.body;

    // Lấy thông tin cũ để ktra
    const [oldData]: any = await pool.query('SELECT id FROM qlhl WHERE id = ?', [req.params.id]);
    if (oldData.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy hàng lỗi để cập nhật' });
    }

    const formatDate = (dateStr: string | null | undefined): string | null => {
      if (!dateStr) return null;
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return null;
        return date.toISOString().split('T')[0];
      } catch {
        return null;
      }
    };

    const formattedNgayTra = formatDate(ngay_tra);
    const formattedNgayGiaoBu = formatDate(ngay_giao_bu);
    const soLuong = Number(sl) || 0;
    const soLuongGiaoBu = Number(giao_bu) || 0;

    const [result]: any = await pool.query(
      `UPDATE qlhl 
       SET sl = ?, giao_bu = ?, ngay_tra = ?, ngay_giao_bu = ? 
       WHERE id = ?`,
      [soLuong, soLuongGiaoBu, formattedNgayTra, formattedNgayGiaoBu, req.params.id]
    );

    res.json({ message: 'Cập nhật thành công' });
  } catch (error: any) {
    console.error('Error updating QLHL:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Xóa QLHL
export const deleteQLHL = async (req: AuthRequest, res: Response) => {
  try {
    const [result]: any = await pool.query('DELETE FROM qlhl WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy' });
    }
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

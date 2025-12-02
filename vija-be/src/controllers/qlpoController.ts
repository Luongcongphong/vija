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
    const { ma_po, ma_bv, so_luong, ngay_tao, ngay_giao } = req.body;

    // Validation
    if (!ma_po || !ma_bv) {
      return res.status(400).json({ message: 'Mã PO và Mã BV là bắt buộc' });
    }

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

    const formattedNgayTao = formatDate(ngay_tao);
    const formattedNgayGiao = formatDate(ngay_giao);
    const soLuong = Number(so_luong) || 0;

    const [result]: any = await pool.query(
      'INSERT INTO qlpo (ma_po, ma_bv, so_luong, ngay_tao, ngay_giao) VALUES (?, ?, ?, ?, ?)',
      [ma_po, ma_bv, soLuong, formattedNgayTao, formattedNgayGiao]
    );

    res.status(201).json({
      message: 'Tạo thành công',
      id: result.insertId
    });
  } catch (error: any) {
    console.error('Error creating QLPO:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message,
      sqlMessage: error.sqlMessage 
    });
  }
};

// Cập nhật PO
export const updateQLPO = async (req: AuthRequest, res: Response) => {
  try {
    console.log('=== UPDATE QLPO ===');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);
    
    const { ma_po, ma_bv, so_luong, ngay_tao, ngay_giao } = req.body;

    // Validation
    if (!ma_po || !ma_bv) {
      console.log('Validation failed: Missing ma_po or ma_bv');
      return res.status(400).json({ message: 'Mã PO và Mã BV là bắt buộc' });
    }

    // Lấy thông tin cũ trước khi update
    const [oldData]: any = await pool.query(
      'SELECT ma_po, ma_bv FROM qlpo WHERE id = ?',
      [req.params.id]
    );

    if (oldData.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy PO để cập nhật' });
    }

    const oldMaPO = oldData[0].ma_po;
    const oldMaBV = oldData[0].ma_bv;

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

    const formattedNgayTao = formatDate(ngay_tao);
    const formattedNgayGiao = formatDate(ngay_giao);
    const soLuong = Number(so_luong) || 0;

    console.log('Formatted dates:', { ngay_tao: formattedNgayTao, ngay_giao: formattedNgayGiao, so_luong: soLuong });
    console.log('Executing UPDATE query...');
    
    // Update QLPO
    const [result]: any = await pool.query(
      'UPDATE qlpo SET ma_po = ?, ma_bv = ?, so_luong = ?, ngay_tao = ?, ngay_giao = ? WHERE id = ?',
      [ma_po, ma_bv, soLuong, formattedNgayTao, formattedNgayGiao, req.params.id]
    );

    console.log('Update result:', result);

    if (result.affectedRows === 0) {
      console.log('No rows affected - PO not found');
      return res.status(404).json({ message: 'Không tìm thấy PO để cập nhật' });
    }

    // Tự động cập nhật QLNB nếu có thay đổi ma_po, ma_bv, hoặc so_luong
    console.log('Updating related QLNB records...');
    const [updateNB]: any = await pool.query(
      'UPDATE qlnb SET ma_po = ?, ma_bv = ?, so_luong = ? WHERE ma_po = ? AND ma_bv = ?',
      [ma_po, ma_bv, soLuong, oldMaPO, oldMaBV]
    );
    
    console.log('QLNB updated:', updateNB.affectedRows, 'rows');

    console.log('Update successful');
    res.json({ 
      message: 'Cập nhật thành công',
      qlnbUpdated: updateNB.affectedRows
    });
  } catch (error: any) {
    console.error('=== ERROR UPDATING QLPO ===');
    console.error('Error:', error);
    console.error('Message:', error.message);
    console.error('SQL Message:', error.sqlMessage);
    console.error('SQL State:', error.sqlState);
    console.error('Errno:', error.errno);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message,
      sqlMessage: error.sqlMessage,
      errno: error.errno
    });
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

// Xóa tất cả PO theo Mã PO
export const deleteQLPOByMaPO = async (req: AuthRequest, res: Response) => {
  try {
    const { ma_po } = req.params;
    
    console.log('=== DELETE PO BY MA_PO ===');
    console.log('Mã PO:', ma_po);
    
    // Đếm số lượng sẽ xóa
    const [countResult]: any = await pool.query(
      'SELECT COUNT(*) as count FROM qlpo WHERE ma_po = ?',
      [ma_po]
    );
    
    const count = countResult[0].count;
    console.log('Số lượng sẽ xóa:', count);
    
    if (count === 0) {
      return res.status(404).json({ message: 'Không tìm thấy PO để xóa' });
    }
    
    // Xóa tất cả
    const [result]: any = await pool.query('DELETE FROM qlpo WHERE ma_po = ?', [ma_po]);
    
    console.log('Đã xóa:', result.affectedRows, 'dòng');
    
    res.json({ 
      message: 'Xóa thành công', 
      deletedCount: result.affectedRows 
    });
  } catch (error: any) {
    console.error('Error deleting PO by ma_po:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

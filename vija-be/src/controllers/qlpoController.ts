import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Lấy tất cả PO
export const getAllQLPO = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        po.*,
        (SELECT dvt FROM qldm WHERE ma_bv = po.ma_bv LIMIT 1) as dvt,
        (SELECT COALESCE(SUM(so_luong_giao), 0) FROM qlpo_delivery WHERE qlpo_id = po.id) as sl_da_giao,
        (SELECT MAX(ngay_giao) FROM qlpo_delivery WHERE qlpo_id = po.id) as ngay_hoan_thanh
      FROM qlpo po
      ORDER BY po.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy PO theo ID
export const getQLPOById = async (req: AuthRequest, res: Response) => {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        po.*,
        (SELECT dvt FROM qldm WHERE ma_bv = po.ma_bv LIMIT 1) as dvt,
        (SELECT COALESCE(SUM(so_luong_giao), 0) FROM qlpo_delivery WHERE qlpo_id = po.id) as sl_da_giao,
        (SELECT MAX(ngay_giao) FROM qlpo_delivery WHERE qlpo_id = po.id) as ngay_hoan_thanh
      FROM qlpo po
      WHERE po.id = ?
    `, [req.params.id]);
    
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
    let { ma_po, ma_bv, ma_kh, so_luong, ngay_tao, ngay_giao, so_bg } = req.body;

    // Validation
    if (!ma_po || !ma_bv) {
      return res.status(400).json({ message: 'Mã PO và Mã BV là bắt buộc' });
    }

    // Nếu không có ma_kh, tự động lấy từ QLDM
    if (!ma_kh) {
      const [qldmRows]: any = await pool.query(
        'SELECT ma_kh FROM qldm WHERE ma_bv = ? LIMIT 1',
        [ma_bv]
      );
      if (qldmRows.length > 0) {
        ma_kh = qldmRows[0].ma_kh;
      }
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
      'INSERT INTO qlpo (ma_po, ma_bv, ma_kh, so_luong, ngay_tao, ngay_giao, so_bg) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ma_po, ma_bv, ma_kh || null, soLuong, formattedNgayTao, formattedNgayGiao, so_bg || '']
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
    
    let { ma_po, ma_bv, ma_kh, so_luong, ngay_tao, ngay_giao } = req.body;

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

    // Nếu không có ma_kh, tự động lấy từ QLDM
    if (!ma_kh) {
      const [qldmRows]: any = await pool.query(
        'SELECT ma_kh FROM qldm WHERE ma_bv = ? LIMIT 1',
        [ma_bv]
      );
      if (qldmRows.length > 0) {
        ma_kh = qldmRows[0].ma_kh;
      }
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

    console.log('Formatted dates:', { ngay_tao: formattedNgayTao, ngay_giao: formattedNgayGiao, so_luong: soLuong });
    console.log('Executing UPDATE query...');
    
    // Update QLPO
    const [result]: any = await pool.query(
      'UPDATE qlpo SET ma_po = ?, ma_bv = ?, ma_kh = ?, so_luong = ?, ngay_tao = ?, ngay_giao = ? WHERE id = ?',
      [ma_po, ma_bv, ma_kh || null, soLuong, formattedNgayTao, formattedNgayGiao, req.params.id]
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
    // Lấy thông tin PO trước khi xóa
    const [poData]: any = await pool.query(
      'SELECT ma_po, ma_bv FROM qlpo WHERE id = ?',
      [req.params.id]
    );
    
    if (poData.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy PO để xóa' });
    }
    
    const { ma_po, ma_bv } = poData[0];
    
    // Xóa PO
    await pool.query('DELETE FROM qlpo WHERE id = ?', [req.params.id]);
    
    // Xóa QLNB tương ứng
    await pool.query('DELETE FROM qlnb WHERE ma_po = ? AND ma_bv = ?', [ma_po, ma_bv]);
    
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
    console.log('Số lượng QLPO sẽ xóa:', count);
    
    if (count === 0) {
      return res.status(404).json({ message: 'Không tìm thấy PO để xóa' });
    }
    
    // Xóa tất cả QLNB liên quan trước
    const [nbResult]: any = await pool.query('DELETE FROM qlnb WHERE ma_po = ?', [ma_po]);
    console.log('Đã xóa QLNB:', nbResult.affectedRows, 'dòng');
    
    // Xóa tất cả QLPO
    const [result]: any = await pool.query('DELETE FROM qlpo WHERE ma_po = ?', [ma_po]);
    console.log('Đã xóa QLPO:', result.affectedRows, 'dòng');
    
    res.json({ 
      message: 'Xóa thành công', 
      deletedCount: result.affectedRows,
      deletedQLNB: nbResult.affectedRows
    });
  } catch (error: any) {
    console.error('Error deleting PO by ma_po:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// ==========================================
// PO DELIVERIES APIs
// ==========================================

export const getDeliveriesByQLPOId = async (req: AuthRequest, res: Response) => {
  try {
    const qlpo_id = req.params.id;
    const [rows] = await pool.query(
      'SELECT * FROM qlpo_delivery WHERE qlpo_id = ? ORDER BY lan_giao ASC',
      [qlpo_id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const createDelivery = async (req: AuthRequest, res: Response) => {
  try {
    const qlpo_id = req.params.id;
    const { so_luong_giao, ngay_giao } = req.body;

    if (!so_luong_giao || !ngay_giao) {
      return res.status(400).json({ message: 'Số lượng giao và Ngày giao là bắt buộc' });
    }

    // Auto calculate lan_giao
    const [existingRows]: any = await pool.query(
      'SELECT COALESCE(MAX(lan_giao), 0) + 1 as next_lan FROM qlpo_delivery WHERE qlpo_id = ?',
      [qlpo_id]
    );
    const lan_giao = existingRows[0].next_lan;

    const [result]: any = await pool.query(
      'INSERT INTO qlpo_delivery (qlpo_id, lan_giao, so_luong_giao, ngay_giao) VALUES (?, ?, ?, ?)',
      [qlpo_id, lan_giao, so_luong_giao, ngay_giao]
    );

    res.status(201).json({
      message: 'Thêm lần giao thành công',
      id: result.insertId,
      lan_giao
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

export const deleteDelivery = async (req: AuthRequest, res: Response) => {
  try {
    const delivery_id = req.params.delivery_id;
    await pool.query('DELETE FROM qlpo_delivery WHERE id = ?', [delivery_id]);
    res.json({ message: 'Xóa lần giao thành công' });
  } catch (error: any) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

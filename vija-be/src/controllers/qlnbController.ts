import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllQLNB = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        nb.*,
        (SELECT ma_kh FROM qldm WHERE ma_bv = nb.ma_bv LIMIT 1) as ma_kh,
        (SELECT dvt FROM qldm WHERE ma_bv = nb.ma_bv LIMIT 1) as dvt
      FROM qlnb nb
      ORDER BY nb.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const getQLNBById = async (req: AuthRequest, res: Response) => {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        nb.*,
        (SELECT ma_kh FROM qldm WHERE ma_bv = nb.ma_bv LIMIT 1) as ma_kh,
        (SELECT dvt FROM qldm WHERE ma_bv = nb.ma_bv LIMIT 1) as dvt
      FROM qlnb nb
      WHERE nb.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const createQLNB = async (req: AuthRequest, res: Response) => {
  try {
    const { ma_po, ma_bv, so_luong, phoi_lieu, gia_cong_ngoai, gia_cong_noi_bo, xu_ly_be_mat, van_chuyen, phi_qldn } = req.body;
    
    // Convert to numbers to avoid string concatenation
    const soLuongNum = Number(so_luong) || 0;
    const phoiLieuNum = Number(phoi_lieu) || 0;
    const giaCongNgoaiNum = Number(gia_cong_ngoai) || 0;
    const giaCongNoiBoNum = Number(gia_cong_noi_bo) || 0;
    const xuLyBeMatNum = Number(xu_ly_be_mat) || 0;
    const vanChuyenNum = Number(van_chuyen) || 0;
    const phiQLDNNum = Number(phi_qldn) || 0;
    
    const tong_phi = phoiLieuNum + giaCongNgoaiNum + giaCongNoiBoNum + xuLyBeMatNum + vanChuyenNum + phiQLDNNum;

    const [result]: any = await pool.query(
      'INSERT INTO qlnb (ma_po, ma_bv, so_luong, phoi_lieu, gia_cong_ngoai, gia_cong_noi_bo, xu_ly_be_mat, van_chuyen, phi_qldn, tong_phi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [ma_po, ma_bv, soLuongNum, phoiLieuNum, giaCongNgoaiNum, giaCongNoiBoNum, xuLyBeMatNum, vanChuyenNum, phiQLDNNum, tong_phi]
    );

    res.status(201).json({
      message: 'Tạo thành công',
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

export const updateQLNB = async (req: AuthRequest, res: Response) => {
  try {
    const { ma_po, ma_bv, phoi_lieu, gia_cong_ngoai, gia_cong_noi_bo, xu_ly_be_mat, van_chuyen, phi_qldn } = req.body;
    
    // Validation
    if (!ma_po || !ma_bv) {
      return res.status(400).json({ message: 'Mã PO và Mã BV là bắt buộc' });
    }
    
    // Lấy số lượng từ QLPO (không cho phép update từ QLNB)
    const [poData]: any = await pool.query(
      'SELECT so_luong FROM qlpo WHERE ma_po = ? AND ma_bv = ? LIMIT 1',
      [ma_po, ma_bv]
    );
    
    const soLuongNum = poData.length > 0 ? Number(poData[0].so_luong) || 0 : 0;
    
    // Convert to numbers to avoid string concatenation
    const phoiLieuNum = Number(phoi_lieu) || 0;
    const giaCongNgoaiNum = Number(gia_cong_ngoai) || 0;
    const giaCongNoiBoNum = Number(gia_cong_noi_bo) || 0;
    const xuLyBeMatNum = Number(xu_ly_be_mat) || 0;
    const vanChuyenNum = Number(van_chuyen) || 0;
    const phiQLDNNum = Number(phi_qldn) || 0;
    
    const tong_phi = phoiLieuNum + giaCongNgoaiNum + giaCongNoiBoNum + xuLyBeMatNum + vanChuyenNum + phiQLDNNum;

    const [result]: any = await pool.query(
      'UPDATE qlnb SET ma_po = ?, ma_bv = ?, so_luong = ?, phoi_lieu = ?, gia_cong_ngoai = ?, gia_cong_noi_bo = ?, xu_ly_be_mat = ?, van_chuyen = ?, phi_qldn = ?, tong_phi = ? WHERE id = ?',
      [ma_po, ma_bv, soLuongNum, phoiLieuNum, giaCongNgoaiNum, giaCongNoiBoNum, xuLyBeMatNum, vanChuyenNum, phiQLDNNum, tong_phi, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi để cập nhật' });
    }

    res.json({ message: 'Cập nhật thành công' });
  } catch (error: any) {
    console.error('Error updating QLNB:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message
    });
  }
};

export const deleteQLNB = async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM qlnb WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

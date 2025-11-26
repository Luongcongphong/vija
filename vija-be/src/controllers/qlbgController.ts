import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Lấy tất cả báo giá
export const getAllQLBG = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM qlbg ORDER BY stt DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy báo giá theo ID
export const getQLBGById = async (req: AuthRequest, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM qlbg WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy tất cả báo giá theo Số BG
export const getQLBGBySoBG = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM qlbg WHERE so_bg = ? ORDER BY stt ASC',
      [req.params.so_bg]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy danh sách Số BG (unique)
export const getAllSoBG = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT so_bg FROM qlbg ORDER BY so_bg DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy đơn giá từ QLDM theo Mã BV và Số lượng
// Logic: Tìm định mức GẦN NHẤT mà số_lượng_nhập > định_mức_trước và <= định_mức_hiện_tại
// VD: SL=50→23đ, SL=100→34đ thì nhập 1-50→23đ, 51-100→34đ, 101+→34đ
export const getDonGia = async (req: AuthRequest, res: Response) => {
  try {
    const { ma_bv, so_luong } = req.query;
    const soLuongNum = Number(so_luong);

    // Lấy tất cả định mức của Mã BV, sắp xếp theo số lượng tăng dần
    const [allRows]: any = await pool.query(
      `SELECT so_luong, don_gia FROM qldm 
       WHERE ma_bv = ? 
       ORDER BY so_luong ASC`,
      [ma_bv]
    );

    if (allRows.length === 0) {
      return res.json({ don_gia: 0, matched_sl: null });
    }

    // Tìm định mức phù hợp
    let selectedPrice = 0;
    let matchedSL = 0;
    let prevSL = 0;

    for (let i = 0; i < allRows.length; i++) {
      const currentRow = allRows[i];
      
      // Nếu số lượng nhập <= định mức hiện tại
      if (soLuongNum <= currentRow.so_luong) {
        selectedPrice = currentRow.don_gia;
        matchedSL = currentRow.so_luong;
        prevSL = i > 0 ? allRows[i - 1].so_luong : 0;
        break;
      }
    }

    // Nếu số lượng nhập > tất cả định mức, lấy định mức cuối
    if (selectedPrice === 0) {
      const lastRow = allRows[allRows.length - 1];
      selectedPrice = lastRow.don_gia;
      matchedSL = lastRow.so_luong;
      prevSL = allRows.length > 1 ? allRows[allRows.length - 2].so_luong : 0;
    }

    // Tạo range string
    let rangeStr = '';
    if (prevSL === 0) {
      rangeStr = `1-${matchedSL}`;
    } else {
      rangeStr = `${prevSL + 1}-${matchedSL}`;
    }

    // Nếu số lượng nhập > định mức cuối
    if (soLuongNum > matchedSL) {
      rangeStr = `${matchedSL}+`;
    }

    res.json({ 
      don_gia: selectedPrice,
      matched_sl: matchedSL,
      range: rangeStr,
      all_ranges: allRows.map((r: any) => ({ so_luong: r.so_luong, don_gia: r.don_gia }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Tạo báo giá mới
export const createQLBG = async (req: AuthRequest, res: Response) => {
  try {
    const { so_bg, ma_bv, so_luong, don_gia } = req.body;
    const thanh_tien = so_luong * don_gia;

    // STT và Số BG sẽ tự động tạo bởi trigger
    const [result]: any = await pool.query(
      'INSERT INTO qlbg (so_bg, ma_bv, so_luong, don_gia, thanh_tien, stt) VALUES (?, ?, ?, ?, ?, 0)',
      [so_bg || '', ma_bv, so_luong, don_gia, thanh_tien]
    );

    // Lấy record vừa tạo để trả về STT và Số BG
    const [newRow]: any = await pool.query('SELECT * FROM qlbg WHERE id = ?', [result.insertId]);

    res.status(201).json({
      message: 'Tạo thành công',
      data: newRow[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Cập nhật báo giá
export const updateQLBG = async (req: AuthRequest, res: Response) => {
  try {
    const { so_bg, ma_bv, so_luong, don_gia } = req.body;
    const thanh_tien = so_luong * don_gia;

    await pool.query(
      'UPDATE qlbg SET so_bg = ?, ma_bv = ?, so_luong = ?, don_gia = ?, thanh_tien = ? WHERE id = ?',
      [so_bg, ma_bv, so_luong, don_gia, thanh_tien, req.params.id]
    );

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Xóa báo giá
export const deleteQLBG = async (req: AuthRequest, res: Response) => {
  try {
    await pool.query('DELETE FROM qlbg WHERE id = ?', [req.params.id]);
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

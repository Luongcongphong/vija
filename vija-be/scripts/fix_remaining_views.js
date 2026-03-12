const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  try {
    console.log("Running fixes...");

    // Rename 'po' to 'ma_po' in qlpo if it hasn't been renamed
    try {
      await conn.query(`ALTER TABLE qlpo CHANGE po ma_po VARCHAR(50) NOT NULL COMMENT 'Mã PO'`);
      console.log("Renamed 'po' to 'ma_po' in qlpo");
    } catch(e) {
      // Might already be named ma_po, or not exist
    }

    // Add 'so_bg' to qlpo
    try {
      await conn.query(`ALTER TABLE qlpo ADD COLUMN so_bg VARCHAR(10) NOT NULL COMMENT 'Số báo giá từ QLBG'`);
      console.log("Added 'so_bg' to qlpo");
    } catch(e) {
      // Might already exist
    }

    // Create v_dashboard View
    await conn.query(`
      CREATE OR REPLACE VIEW v_dashboard AS
      SELECT 
        bg.id,
        bg.stt,
        bg.so_bg,
        po.ma_po,
        bg.ma_bv,
        bg.so_luong,
        bg.don_gia,
        bg.thanh_tien,
        COALESCE(nb.phoi_lieu, 0) as phoi_lieu,
        COALESCE(nb.gia_cong_ngoai, 0) as gia_cong_ngoai,
        COALESCE(nb.gia_cong_noi_bo, 0) as gia_cong_noi_bo,
        COALESCE(nb.xu_ly_be_mat, 0) as xu_ly_be_mat,
        COALESCE(nb.van_chuyen, 0) as van_chuyen,
        COALESCE(nb.phi_qldn, 0) as phi_qldn,
        COALESCE(nb.tong_phi, 0) as tong_phi,
        (bg.thanh_tien - COALESCE(nb.tong_phi, 0)) as loi_nhuan,
        CASE 
          WHEN bg.thanh_tien > 0 THEN 
            ROUND(((bg.thanh_tien - COALESCE(nb.tong_phi, 0)) / bg.thanh_tien * 100), 2)
          ELSE 0 
        END as ty_le,
        bg.created_at as ngay_tao
      FROM qlbg bg
      LEFT JOIN qlpo po ON bg.so_bg = po.so_bg
      LEFT JOIN qlnb nb ON bg.so_bg = nb.so_bg AND bg.ma_bv = nb.ma_bv
      ORDER BY bg.stt DESC;
    `);
    console.log("v_dashboard created successfully.");

  } catch(e) {
    console.error(e.message);
  }
  
  await conn.end();
}

run();

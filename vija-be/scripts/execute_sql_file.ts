import fs from 'fs';
import path from 'path';
import pool from '../src/config/database';

async function executeSqlFile() {
  const sqlFile = path.join(__dirname, '../database_new_fixed.sql');
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');

  // Remove comments and multi-line comments that might mess with splitting
  const cleanSql = sqlContent
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  const statements = cleanSql
    .split(';')
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0);

  const connection = await pool.getConnection();

  try {
    console.log('Bắt đầu chạy migration file database_new_fixed.sql...');
    for (const stmt of statements) {
      // Need to handle DELIMITER $$ properly or skip trigger creation if it is complex.
      // Wait, the SQL file has triggers: DELIMITER $$. 
      // Splitting by ; will break the trigger syntax.
      // Let's just execute the entire thing using execute with multipleStatements enabled.
    }
  } catch (error) {
    console.error('Lỗi khi chạy migration:', error);
  } finally {
    connection.release();
  }
}

executeSqlFile();

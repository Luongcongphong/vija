require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'vija',
    password: process.env.DB_PASSWORD || 'vija@2024',
    database: process.env.DB_NAME || 'vija',
  });

  const sql = fs.readFileSync('migrations/create_qlhl_table.sql', 'utf8');
  await connection.query(sql);
  console.log('Migration OK');
  process.exit(0);
}

runMigration().catch(err => {
  console.error(err);
  process.exit(1);
});

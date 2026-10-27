// db.js — Database connection
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+05:30'
});

const db = pool.promise();

pool.getConnection((err, connection) => {
  if (err) { console.error('❌ DB connection failed:', err.message); return; }
  console.log('✅ MySQL connected to agriproject_db!');
  connection.release();
});

module.exports = db;
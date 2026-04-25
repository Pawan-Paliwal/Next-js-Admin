const mysql = require('mysql2');
// Create connection pool
const db = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'chanderpur_web',
  dateStrings: true,
});
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('MySQL connected');
    connection.release();
  }
});
module.exports = db;

import * as mysql from 'mysql2';
import * as dotenv from 'dotenv';
dotenv.config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: '', 
});

connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME}`, function (err) {
  if (err) {
    console.error('Error creating database:', err.message);
  } else {
    console.log('Database created successfully.');
  }

  connection.end();
});

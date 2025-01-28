const mysql = require('mysql2');
require('dotenv').config();

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,     // Your MySQL server host
  user: process.env.DB_USER,          // Your MySQL username
  password: process.env.DB_PASSWORD,  // Your MySQL password
  database: process.env.DB_DATABASE  // Your MySQL database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;
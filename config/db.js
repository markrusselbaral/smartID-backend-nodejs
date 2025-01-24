const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',     // Your MySQL server host
  user: 'mark',          // Your MySQL username
  password: 'baral22222',  // Your MySQL password
  database: 'smartid_db'  // Your MySQL database name
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
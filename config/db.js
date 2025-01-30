const mysql = require('mysql2');
require('dotenv').config();

// Create Local Database Connection
const localDB = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Create Production Database Connection
const prodDB = mysql.createConnection({
  host: process.env.PROD_DB_HOST,
  user: process.env.PROD_DB_USER,
  password: process.env.PROD_DB_PASSWORD,
  database: process.env.PROD_DB_DATABASE
});

// Connect to Local Database
localDB.connect((err) => {
  if (err) {
    console.error('Error connecting to LOCAL database: ' + err.stack);
    return;
  }
  console.log(`Connected to LOCAL database as id ${localDB.threadId}`);
});

// Connect to Production Database
prodDB.connect((err) => {
  if (err) {
    console.error('Error connecting to PROD database: ' + err.stack);
    return;
  }
  console.log(`Connected to PRODUCTION database as id ${prodDB.threadId}`);
});

// Export both connections
module.exports = { localDB, prodDB };
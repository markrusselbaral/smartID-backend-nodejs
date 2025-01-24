const mysql = require('mysql2');
const connection = require('../config/db');

class SmsQueue {
  getSmsQueue() {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT sq.*, s.*, sq.id as sq_id
                        FROM sms_queue sq
                        JOIN students s ON sq.student_id = s.id
                        WHERE sq.is_sent = 0 
                        ORDER BY sq.id ASC 
                        LIMIT 1`, (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          return reject(error);
        }
  
        if (results.length > 0) {
          resolve(results[0]);
        } else {
          console.log('No records found for the given condition.');
          resolve(null);
        }
      });
    });
  }

  updateSmsQueueStatusToSent(id) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE sms_queue SET is_sent = 1 WHERE id = ?";
      connection.query(query, [id], (error, results) => {
        if (error) {
          console.error("Error executing query:", error);
          return reject(error);
        }
  
        // Check if any rows were affected
        if (results.affectedRows > 0) {
          console.log(`SMS queue record with ID ${id} updated successfully.`);
          resolve(results);
        } else {
          console.log("No records updated for the given ID.");
          resolve(null);
        }
      });
    });
  }
  

}

module.exports = SmsQueue;
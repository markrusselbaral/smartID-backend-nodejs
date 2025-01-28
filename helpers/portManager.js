const mysql = require('mysql2');
const connection = require('../config/db');

class PortManager {
  getActivePort() {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT path FROM ports LIMIT 1`, (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          return reject(error);
        }
  
        if (results.length > 0) {
          resolve(results[0].path);
        } else {
          console.log('No records found for the given condition.');
          resolve(null);
        }
      });
    });
  }


  getPortOptions() {
    return {
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: "none",
        rtscts: false,
        xon: false,
        xoff: false,
        xany: false,
        autoDeleteOnReceive: true,
        enableConcatenation: true,
        incomingCallIndication: true,
        incomingSMSIndication: true,
        pin: "",
        customInitCommand: "",
        cnmiCommand: "AT+CNMI=2,1,0,2,1",
        logger: console,
    };
  }
}

module.exports = PortManager;
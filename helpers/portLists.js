const serialportgsm = require('serialport-gsm');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

class PortList {

  // Method to list available serial ports with manufacturer as name
  listPorts() {
    return new Promise((resolve, reject) => {
      serialportgsm.list((err, result) => {
        if (err) {
          reject('Error listing ports:', err);
        } else {
          // Modify result to return manufacturer (if available) or path as name
          const formattedPorts = result.map(port => ({
            path: port.path,
            name: port.manufacturer || 'Unknown Manufacturer', // Default to 'Unknown Manufacturer' if not available
          }));
          resolve(formattedPorts);
        }
      });
    });
  }

  // Method to get the ports, now it returns the promise result
  async getPorts() {
    try {
      const ports = await this.listPorts();
      return ports;  // Return the ports so it can be accessed
    } catch (err) {
      console.error(err);
      return []; // Return an empty array in case of an error
    }
  }

  
  async getActivePort() {
    try {
        // Correct file path (move up one level to access config/)
        const filePath = path.join(__dirname, '..', 'config', 'port.txt');

        // Read file contents
        const fileContent = await fs.readFile(filePath, 'utf8');

        // Extract the PORT value using regex
        const match = fileContent.match(/^PORT=(.*)$/m);
        
        if (match && match[1]) {
            console.log(`Active Port: ${match[1]}`);
            return match[1]; // Return the port value
        } else {
            throw new Error('PORT value not found in port.txt');
        }
    } catch (error) {
        console.error('Error reading the port file:', error);
        return null;
    }
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

module.exports = PortList;

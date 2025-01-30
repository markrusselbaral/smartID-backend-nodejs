const serialportgsm = require('serialport-gsm');
const axios = require('axios');
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
        const kioskId = 1;
        const response = await axios.get(`${process.env.BASE_URL}/get-active-port/${kioskId}`);
        return response.data.activePort.path;
    } catch (error) {
      console.error('There was an error!', error);
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

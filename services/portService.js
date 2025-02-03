const axios = require('axios');
const fs = require('fs').promises;
const path = require('path')
const BaseUrl = require('../config/baseUrl');
require('dotenv').config();

const baseUrl = new BaseUrl();

class PortService {
 
  async reloadPorts(id, ports) {
    try {
        const response = await axios.get(`${baseUrl.baseUrl()}/reload-ports/${id}`, { params: { ports: ports } });
        console.log(response.data);
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  async updatePortActiveStatus(portId, kioskId) {
      try {
          const response = await axios.get(`${baseUrl.baseUrl()}/turn-on-port/${portId}/${kioskId}`);
          const activePort = response.data.portPath;
          console.log(response.data);

          if (!activePort) {
              console.error("No active port received!");
              return;
          }

          // Correct file path (move up one level to access config/)
          const filePath = path.join(__dirname, '..', 'config', 'port.txt');

          let fileContent = await fs.readFile(filePath, 'utf8');

          // Replace PORT value
          fileContent = fileContent.replace(/PORT=.*/, `PORT=${activePort}`);

          // Write the updated content back to the file
          await fs.writeFile(filePath, fileContent, 'utf8');
          
          console.log(`Updated PORT in port.txt to: ${activePort}`);
      } catch (error) {
          console.error('Error updating the port file:', error);
      }
  }



}


module.exports = PortService;
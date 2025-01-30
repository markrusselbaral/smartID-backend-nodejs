const axios = require('axios');
require('dotenv').config();

class PortService {
 
  async reloadPorts(id, ports) {
    try {
        const response = await axios.get(`${process.env.BASE_URL}/reload-ports/${id}`, { params: { ports: ports } });
        console.log(response.data);
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  async updatePortActiveStatus(portId, kioskId) {
    try {
        const response = await axios.get(`${process.env.BASE_URL}/turn-on-port/${portId}/${kioskId}`);
        console.log(response.data);
    } catch (error) {
      console.error('There was an error!', error);
    }
  }
}


module.exports = PortService;
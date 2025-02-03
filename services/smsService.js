const axios = require('axios');
require('dotenv').config();

class SmsService {
 
  async smsQueue() {
    try {
        const response = await axios.get(`${process.env.NODE_BASE_URL}/get-sms-queue`);
        return response.data.smsQueue;
    } catch (error) {
      console.error('There was an error!', error);
    }
  }
}


module.exports = SmsService;
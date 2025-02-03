const axios = require('axios');
require('dotenv').config();
const BaseUrl = require('../config/baseUrl');

const baseUrl = new BaseUrl();

class SmsService {
 
  async smsQueue() {
    try {
        const response = await axios.get(`${baseUrl.baseUrl()}/get-sms-queue`);
        return response.data.smsQueue;
    } catch (error) {
      console.error('There was an error!', error);
    }
  }
}


module.exports = SmsService;
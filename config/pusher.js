
const PusherClient = require('pusher-js');
require('dotenv').config();

// Create pusher Connection
const pusher = new PusherClient('857d695ff6e8286c36e6', {
  cluster: 'ap1',
  encrypted: true,
});



// Export connections
module.exports = pusher;
const PortService = require('./services/portService');
const PusherClient = require('./config/pusher');
const PortLists = require('./helpers/portLists');

const portService = new PortService();
const portLists = new PortLists();


// Reload ports
const channel = PusherClient.subscribe('port-display-channel');
channel.bind('start-processing', async (data) => {
  const ports = await portLists.getPorts();
  portService.reloadPorts(data.id, ports);
});


// update port active status
const channel2 = PusherClient.subscribe('port-status-channel');
channel2.bind('start-processing', (data) => {
  portService.updatePortActiveStatus(data.portId, data.kioskId);
});


console.log('port.js is running');
  
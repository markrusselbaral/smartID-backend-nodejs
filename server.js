const WebSocket = require('ws');
let serialportgsm = require("serialport-gsm");
const SmsService = require('./services/smsService');
const PortLists = require('./helpers/portLists');

const smsService = new SmsService();
const portLists = new PortLists();

let modem = serialportgsm.Modem();
const wss = new WebSocket.Server({ port: 8080, host: '0.0.0.0' });



let isModemInitialized = false; // Track modem initialization state
let isPortOpen = false; // Track port open state
let isProcessing = false; // Flag to indicate if the function is running

const processSendingMessage = async () => {
    if (isProcessing) {
        console.log("Waiting for the current execution to finish...");
        return;
    }
    console.log("Processing start.");
    isProcessing = true;

    try {
        const portId = await portLists.getActivePort();
        const smsInfo = await smsService.smsQueue();

        // Check if SMS info is available
        if (!smsInfo) {
            console.log("No SMS queue data found.");
            return;
        }

        sendSMS(portId, smsInfo.parent_contact, smsInfo.first_name, smsInfo.last_name, smsInfo.sq_id);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        console.log("Processing complete.");
        isProcessing = false; // Reset the flag after processing is complete
    }
};


const sendSMS = (portId, parent_contact, first_name, last_name, sq_id) => {
    // Open the port only if it's not already open
    if (!isPortOpen) {
        modem.open(portId, portLists.getPortOptions(), (error) => {
            if (error) {
                console.error("Error opening modem port:", error);
                return;
            }
            console.log("Modem port opened successfully.");
            isPortOpen = true; // Set the flag to indicate the port is open
            initializeAndSendSMS(portId, parent_contact, first_name, last_name, sq_id);
        });
    } else {
        initializeAndSendSMS(portId, parent_contact, first_name, last_name, sq_id);
    }
};

const initializeAndSendSMS = (portId, parent_contact, first_name, last_name, sq_id) => {
    // Initialize the modem only if it hasn't been initialized
    if (!isModemInitialized) {
        modem.initializeModem(() => {
            console.log("Modem is initialized.");
            isModemInitialized = true; // Set the flag
            sendSMSMessage(parent_contact, first_name, last_name, sq_id);
        });
    } else {
        // Directly send the SMS if the modem is already initialized
        sendSMSMessage(parent_contact, first_name, last_name, sq_id);
    }
};

const sendSMSMessage = (parent_contact, first_name, last_name, sq_id) => {
    modem.sendSMS(parent_contact, `${first_name} ${last_name}`, false, (data) => {
        console.log("SMS sent successfully:", data.response);
        processSendingMessage(); // Process the next SMS
    });
};


modem.on('onSendingMessage', (result) => {
    console.log('onSendingMessage',result)
});





const startUp = async () => { 
    const portId = await portLists.getActivePort();
    modem.open(portId, portLists.getPortOptions(), (error) => {
        if (error) {
            console.error("Error opening modem port:", error);
            return;
        }
        console.log("Modem port opened successfully.");
        isPortOpen = true; // Set the flag to indicate the port is open
    });

    modem.initializeModem(() => {
        console.log("Modem is initialized.");
        isModemInitialized = true; // Set the flag
    });
    
}

startUp();



wss.on('connection', (ws) => {
    console.log('Client connected');
    
    ws.on('message', (message) => {

        if(!isProcessing){
            processSendingMessage();
        }
        console.log(`Received message => ${message}`);
    });

    ws.send('Connected to WebSocket Server');
});
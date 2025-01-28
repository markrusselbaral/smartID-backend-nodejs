const WebSocket = require('ws');
let serialportgsm = require("serialport-gsm");
const PortManager = require('./helpers/portManager');
const SmsQueue = require('./helpers/smsQueue');

const portManager = new PortManager();
const smsQueue = new SmsQueue();

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
        const portId = await portManager.getActivePort();
        const smsInfo = await smsQueue.getSmsQueue();

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
        modem.open(portId, portManager.getPortOptions(), (error) => {
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
        console.log("SMS sent successfully:", data);

        // Update the SMS queue after sending the SMS
        smsQueue.updateSmsQueueStatusToSent(sq_id).then(() => {
            console.log(`SMS queue updated for ID: ${sq_id}`);
        }).catch((error) => {
            console.error("Error updating SMS queue:", error);
        });
    });
};



wss.on('connection', (ws) => {
    console.log('Client connected');
    
    ws.on('message', (message) => {
        // processSendingMessage()
        if(!isProcessing){
            processSendingMessage();
        }
        console.log(`Received message => ${message}`);
    });

    ws.send('Connected to WebSocket Server');
});


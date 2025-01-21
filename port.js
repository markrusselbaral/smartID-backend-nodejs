// Import required packages
const Pusher = require('pusher');
const PusherClient = require('pusher-js');
const serialportgsm = require('serialport-gsm');
const connection = require('./config/db');

// Initialize Pusher for triggering events
const pusher = new Pusher({
  appId: '1927653',
  key: '857d695ff6e8286c36e6',
  secret: '92ce9aa2c7754ee9198d',
  cluster: 'ap1',
  useTLS: true,
});

// Initialize Pusher for subscribing to events
const pusherClient = new PusherClient('857d695ff6e8286c36e6', {
  cluster: 'ap1',
  encrypted: true,
});


// Subscribe to Pusher events
const channel = pusherClient.subscribe('kiosks-channel');
channel.bind('start-processing', (data) => {
  console.log('Received start-processing event from Pusher:', data);
  processSerialPorts();
});






const processSerialPorts = () => {
  // Open the connection once at the start
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ', err);
      return;
    }
    console.log('Connected to the database.');

    // Call deletePorts, and once it's done, call insertPorts
    deletePorts(() => {
      insertPorts(() => {
        updatePortStatus();
        // Only close the connection after both operations are done
      });
    });
  });
}

const deletePorts = (callback) => {
  const deleteSql = "DELETE FROM ports";
  connection.execute(deleteSql, (err, result) => {
    if (err) {
      console.error('Error truncating data: ', err);
      return;
    }
    console.log('Existing data truncated successfully.');
    callback(); // Proceed to insertPorts after truncation
  });
}


const insertPorts = (callback) => {
  // List all serial ports
  serialportgsm.list((err, result) => {
    if (err) {
      console.error('Error listing serial ports:', err);
      return;
    }

    // Iterate over the result to insert each serial port into the database
    result.forEach(entry => {
      const values = [entry.path, entry.serialNumber || 'Unknown'];
      const sql = "INSERT INTO ports (path, name) VALUES (?, ?)";

      connection.execute(sql, values, (err, result) => {
        if (err) {
          console.error('Error inserting data: ', err);
          return;
        }
        console.log('Data inserted successfully:');
      });
    });

    callback(); // Proceed with closing the connection after insertion
  });
}


const updatePortStatus = async () => {
  try {
    const [rows] = await connection.promise().query("SELECT * FROM ports_status WHERE id = 1");

    if (rows && rows.length > 0) {
      const successCount = rows[0].success_count + 1;
      await connection.promise().query(
        "UPDATE ports_status SET success_count = ? WHERE id = 1",
        [successCount]
      );
      console.log('Port status updated successfully!');
    } else {
      console.log('No matching record found for update.');
    }
  } catch (err) {
    console.error('Error updating port status:', err);
  }
};

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const BaseUrl = require('./config/baseUrl');

const baseUrl = new BaseUrl();

const downloadAndImportSQL = async () => {
    const url = `${baseUrl.prodBaseUrl()}/api/download-students`; // Laravel API URL
    const apiKey = `${baseUrl.prodApiKey()}`;
    const folderPath = path.join(__dirname, 'sql'); // SQL folder
    const filePath = path.join(folderPath, 'students_backup.sql'); // Full file path

    console.log(url)
    try {
        // Ensure the sql folder exists
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream', // Important for downloading files
            headers: {
                'X-API-KEY': apiKey // Send API key in headers
            }
            
        });

        // Create a write stream
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        writer.on('finish', () => {
            console.log('Download completed:', filePath);

            // Import the SQL file into the MySQL Docker container
            const command = `docker exec -i mysql-container mysql -u mark -pbaral22222 smartid_db < ${filePath}`;

            exec(command, (err, stdout, stderr) => {
                if (err) {
                    console.error('SQL Import Failed:', stderr);
                    return;
                }
                console.log('SQL Import Successful');
            });
        });

        writer.on('error', (err) => {
            console.error('Download failed:', err);
        });

    } catch (error) {
        console.error('Error downloading file:', error.message);
    }
   
};




downloadAndImportSQL();

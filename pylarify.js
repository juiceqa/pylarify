// Import the required libraries
const UserAgent = require('user-agents');
const axios = require('axios');
const fs = require('fs');
const userAgent = new UserAgent();

// Function to import JSON files
function importJsonFile(index) {
    return require(`./fixtures/${index}.json`);
}

// Function to send API requests and collect results
async function sendRequest(data) {
    try {
        const response = await axios({
            method: 'POST',
            url: 'https://www.pylarify.com/api/location/search',
            headers: {
                'Language': 'Language: en-US,en;q=0.$5$',
                'User-Agent': userAgent.toString(),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,/;q=0.8',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
                'cookie': '_gcl_au=1.1.1539027924.1666903935; _fbp=fb.1.1666903934945.437512069; _ga_DNCFS6ZVQ7=GS1.1.1667005436.3.0.1667005436.0.0.0; _ga=GA1.2.1253772167.1666903935; _gid=GA1.2.618103297.1667005437; _gat_UA-175193909-2=1',
                'Origin': 'https://www.pylarify.com',
                'Connection': 'close',
                'Referer': 'https://www.pylarify.com/site-locator',
                'X-Forwarded-For': '127.0.0.1'
            },
            data: data,
        });

        const responseBody = response.data;
        //    console.log('Response:', responseBody);


        return {
            locationName: responseBody.locationName || null,
            centerType: responseBody.centerType || null,
            address1: responseBody.address1 || null,
            address2: responseBody.address2 || null,
            city: responseBody.city || null,
            state: responseBody.state || null,
            zip: responseBody.zip || null,
            phoneNumber: responseBody.phoneNumber || null,
            phoneExtension: responseBody.phoneExtension || null,
            websiteUrl: responseBody.websiteUrl || null,
            treatmentCenterId: responseBody.treatmentCenterId || null,
            latitude: responseBody.latitude || null,
            longitude: responseBody.longitude || null,
            createdDtTm: responseBody.createdDtTm || null,
            modifiedDtTm: responseBody.modifiedDtTm || null,
        };
    } catch (error) {
        console.error("Request failed:", error);
        throw error;
    }
}

// Function to execute the main logic
async function processJsonFile(index) {
    const testData = importJsonFile(index);
    const results = [];

    const startTime = new Date();
    console.log(`Processing file ${index}.json (started at ${startTime.toISOString()})...`);

    for (const data of testData) {
        results.push(await sendRequest(data));
    }

    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000;
    console.log(`Finished processing file ${index}.json (took ${timeTaken.toFixed(2)} seconds).`);
    return results;
}

(async() => {
    const overallStartTime = new Date();
    console.log(`Overall process started at ${overallStartTime.toISOString()}`);

    const csvs = [];

    // Run processJsonFile for all the JSON files (1-16)
    for (let i = 1; i <= 16; i++) {
        const results = await processJsonFile(i);
        csvs.push(...results);

        const progress = Math.round((i / 16) * 100);
        console.log(`Progress: ${progress}%`);
    }

    const overallEndTime = new Date();
    const overallTimeTaken = (overallEndTime - overallStartTime) / 1000;
    console.log(`Overall process finished (took ${overallTimeTaken.toFixed(2)} seconds).`);

    // Convert the results into CSV format
    const csvData = csvs.map(result => Object.values(result).join(',')).join('\n');
    console.log('CSV Data:', csvData);

    // Write the CSV data to a file
    fs.writeFileSync('siteLocator.csv', csvData);
})();
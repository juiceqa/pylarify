// Import the required libraries
const UserAgent = require('user-agents');
const axios = require('axios');
const fs = require('fs');
const userAgent = new UserAgent();

// Function to import JSON files
function importJsonFile(index) {
    return require(`./fixtures/${index}.json`);
}

function removeDuplicates(rows) {
    const uniqueRows = [];
    const ids = new Set();

    for (const row of rows) {
        const treatmentCenterId = row[10]; // Changed from row.treatmentCenterId
        if (!ids.has(treatmentCenterId)) {
            uniqueRows.push(row);
            ids.add(treatmentCenterId);
        }
    }

    return uniqueRows;
}
// Function to send batch API requests and collect results
async function sendBatchRequests(data) {
    try {
        const response = await axios.post('https://www.pylarify.com/api/location/search', data, {
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

        return responseBody.map(result => ({
            locationName: result.locationName || null,
            centerType: result.centerType || null,
            address1: result.address1 || null,
            address2: result.address2 || null,
            city: result.city || null,
            state: result.state || null,
            zip: result.zip || null,
            phoneNumber: result.phoneNumber || null,
            phoneExtension: result.phoneExtension || null,
            websiteUrl: result.websiteUrl || null,
            treatmentCenterId: result.treatmentCenterId || null,
            latitude: result.latitude || null,
            longitude: result.longitude || null,
            createdDtTm: result.createdDtTm || null,
            modifiedDtTm: result.modifiedDtTm || null,
        }));
    } catch (error) {
        console.error("Request failed:", error);
        return [];
    }
}

// Function to execute the main logic
async function processJsonFile(index) {
    const testData = importJsonFile(index);
    const results = [];

    const startTime = new Date();
    console.log(`Processing file ${index}.json (started at ${startTime.toISOString()})...`);

    const batchSize = 10;
    const batches = [];

    // Split the data into batches of size batchSize
    for (let i = 0; i < testData.length; i += batchSize) {
        batches.push(testData.slice(i, i + batchSize));
    }

    // Send batch requests and collect results
    for (const batch of batches) {
        const batchResults = await sendBatchRequests(batch);
        results.push(...batchResults);
    }

    const endTime = Date();

    // Calculate and log the total time taken to process the file
    const timeTaken = (endTime - startTime) / 1000;
    console.log(`Finished processing file ${index}.json(took ${timeTaken.toFixed(2)}
        seconds).`);

    return results;
}

(async() => {
    const overallStartTime = new Date();
    console.log(`Overall process started at ${ overallStartTime.toISOString() }`);

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
    console.log(`Overall process finished (took ${overallTimeTaken.toFixed(2)} seconds).)`);

    // Convert the results into CSV format
    const csvData = csvs.map(result => Object.values(result).join(',')).join('\n');
    console.log('CSV Data:', csvData);

    // Write the CSV data to a file
    fs.writeFileSync('siteLocator.csv', csvData);
})();
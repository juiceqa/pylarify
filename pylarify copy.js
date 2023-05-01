const axios = require('axios');
const { createObjectCsvWriter } = require('csv-writer');
const UserAgent = require('user-agents');
const async = require('async');
const fs = require('fs');
const path = require('path');

function getJSONFilePaths() {
    const dir = './fixtures';
    const files = fs.readdirSync(dir);
    const jsonFilePaths = files.filter(file => path.extname(file) === '.json').map(file => path.join(dir, file));
    return jsonFilePaths;
}

const csvWriter = createObjectCsvWriter({
    path: 'siteLocator.csv',
    header: [
        { id: 'locationName', title: 'Location Name' },
        { id: 'centerType', title: 'Center Type' },
        { id: 'address1', title: 'Address 1' },
        { id: 'address2', title: 'Address 2' },
        { id: 'city', title: 'City' },
        { id: 'state', title: 'State' },
        { id: 'zip', title: 'Zip' },
        { id: 'phoneNumber', title: 'Phone Number' },
        { id: 'phoneExtension', title: 'Phone Extension' },
        { id: 'websiteUrl', title: 'Website URL' },
        { id: 'treatmentCenterId', title: 'Treatment Center ID' },
        { id: 'latitude', title: 'Latitude' },
        { id: 'longitude', title: 'Longitude' },
        { id: 'createdDtTm', title: 'Created Date Time' },
        { id: 'modifiedDtTm', title: 'Modified Date Time' },
    ]
});

function removeDuplicates(rows) {
    const uniqueRows = [];
    const ids = new Set();

    for (const row of rows) {
        const treatmentCenterId = row.treatmentCenterId;
        if (!ids.has(treatmentCenterId)) {
            uniqueRows.push(row);
            ids.add(treatmentCenterId);
        }
    }

    return uniqueRows;
}

async function fetch_data(coordinate, maxRetries = 3, timeout = 5000000) {
    const userAgent = new UserAgent();
    const headers = { 'User-Agent': userAgent.toString() };

    for (let retry = 0; retry < maxRetries; retry++) {
        try {
            const response = await axios.post('https://www.pylarify.com/api/location/search', coordinate, { headers, timeout });
            return response.data;
        } catch (error) {
            if (error.code === 'ETIMEDOUT' && retry < maxRetries - 1) {
                console.warn(`Request timeout, retrying (${retry + 1}/${maxRetries})...`);
                continue;
            } else {
                console.error(error);
                return null;
            }
        }
    }
}


async function processJsonFile(index) {
    const testData = require(`./fixtures/${index}.json`);
    const results = [];

    const fetch = async(coordinate) => {
        const batchResults = await fetch_data(coordinate);
        if (batchResults && batchResults.length > 0) {
            results.push(...batchResults);
        }
    };

    await async.eachLimit(testData, PARALLEL_REQUESTS, fetch);

    const uniqueResults = removeDuplicates(results);
    await csvWriter.writeRecords(uniqueResults);
    console.log(`CSV file written for JSON file ${index}.`);
}

async function main() {
    // Get the JSON file paths
    const jsonFilePaths = getJSONFilePaths();

    let results = [];

    for (let i = 0; i < jsonFilePaths.length; i++) {
        console.log(`Processing JSON file ${i + 1}...`);

        // Read and parse JSON file
        const jsonContent = fs.readFileSync(jsonFilePaths[i], 'utf8');
        const coordinates = JSON.parse(jsonContent);

        for (const coordinate of coordinates) {
            const data = await fetch_data(coordinate);
            if (data) {
                results = results.concat(data);
            }
        }

        console.log(`CSV file written for JSON file ${i + 1}.`);
    }

    const uniqueResults = removeDuplicates(results);
    await csvWriter.writeRecords(uniqueResults);
    console.log('All JSON files processed successfully.');
}

main().catch(error => {
    console.error("Error processing JSON files:", error);
});
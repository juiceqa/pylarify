const { promisify } = require('util');
const UserAgent = require('user-agents');
const axios = require('axios');
const fs = require('fs');
const userAgent = new UserAgent();
const stringify = require('csv-stringify');
var polygon = {
    "type": "Polygon",
    "coordinates": [
        [
            [-125.0, 24.0],
            [-66.9, 24.0],
            [-66.9, 49.0],
            [-125.0, 49.0],
            [-125.0, 24.0]
        ]
    ]
}
const appendFileAsync = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(file, data, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

async function processJsonFile(index) {
    const data = require('cypress/fixtures/${index}.json'); // add this line
    console.log(`Processing file ${index}.json...`);
    const startTime = new Date();

    const csvs = []; // move this here so that a new array is created for each JSON file
    const results = await Promise.all(
        data.map(async(row) => {
            const request = {
                requestBody: {
                    searchOptions: {
                        searchTerm: row.searchTerm,
                        maxResults: 500, // change this value to 500
                        location: polygon,
                    },
                },
            };
            const response = await axios.post("https://www.pylarify.com/api/location/search", request); // add axios.post()
            csvs.push(response.data);
        }) // remove this line
    );

    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000;
    console.log(`Finished processing file ${index}.json (took <span class="math-inline">\{timeTaken\.toFixed\(2\)\} seconds\)\.\`\);
// create the csv file for this index
const csvString \= stringify\(csvs\[index\]\);;
const csvFilename \= \`results\-</span>{index}.csv`)

    try {
        // append the csv to the file
        await appendFileAsync(csvFilename, csvString);
        console.log(`Results for file ${index}.json appended to ${csvFilename}.`);
    } catch (error) {
        console.error(`Failed to append results for file ${index}.json to ${csvFilename}:`, error);
    }

    return results.filter((result) => result.treatmentCenterId !== null && result.treatmentCenterId !== '');
}

// Main function
async function main() {
    // Process each JSON file
    const jsonFileCount = 10;
    for (let i = 1; i <= jsonFileCount; i++) {
        const results = await processJsonFile(i);
    }
    // concatenate all csv files
    const finalCsvString = csvs.map((csv, index) => csv.slice(1).map(row => [index, ...row]).join('\n')).join('\n');
    const finalCsvFilename = 'results-all.csv';

    try {
        await appendFileAsync(finalCsvFilename, finalCsvString);
        console.log(`All results appended to ${finalCsvFilename}.`);

    } catch (error) {
        console.error(`Failed to append all results to ${finalCsvFilename}:`, error);
    }
}
main();
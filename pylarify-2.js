// Import the required libraries
const UserAgent = require('user-agents');
const axios = require('axios');
const fs = require('fs');
const userAgent = new UserAgent();
const regions = [
    { name: "Northwest", latMin: 45.5, latMax: 49, lngMin: -125, lngMax: -116.5 },
    { name: "Southwest", latMin: 31, latMax: 36.5, lngMin: -123, lngMax: -114.5 },
    { name: "Northeast", latMin: 39, latMax: 43, lngMin: -79, lngMax: -70.5 },
    { name: "Southeast", latMin: 25, latMax: 31, lngMin: -89, lngMax: -78 },
];

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

async function processJsonFile(region) {
    const results = [];

    const startTime = new Date();
    console.log(`Processing region ${region.name} (started at ${startTime.toISOString()})...`);

    const latitudes = [];
    const longitudes = [];

    // Generate the list of latitudes and longitudes in the region
    for (let lat = region.latMin; lat <= region.latMax; lat += 0.1) {
        latitudes.push(lat.toFixed(1));
    }
    for (let lng = region.lngMin; lng <= region.lngMax; lng += 0.1) {
        longitudes.push(lng.toFixed(1));
    }

    // Query the API for each latitude and longitude pair in the region
    for (const latitude of latitudes) {
        for (const longitude of longitudes) {
            const data = { latitude, longitude };
            results.push(await sendRequest(data));
        }
    }

    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000;
    console.log(`Finished processing region ${region.name} (took ${timeTaken.toFixed(2)} seconds).`);
    return results;
}


(async() => {
    const overallStartTime = new Date();
    console.log(`Overall process started at ${overallStartTime.toISOString()}`);

    const csvs = [];

    // Run processJsonFile for all the regions
    for (const region of regions) {
        const results = await processJsonFile(region);
        csvs.push(...results);

        console.log(`Finished processing ${results.length} locations in ${region.name}`);
    }

    const overallEndTime = new Date();
    const overallTimeTaken = (overallEndTime - overallStartTime) / 1000;
    console.log(`Overall process finished (took ${overallTimeTaken.toFixed(2)} seconds).`); // Convert the results into CSV format
    const csvData = csvs.map((result) => Object.values(result).join(",")).join("\n");
    console.log("CSV Data:", csvData);

    // Write the CSV data to a file
    fs.writeFileSync("siteLocator.csv", csvData);
})();
const UserAgent = require('user-agents');
const axios = require('axios');
const fs = require('fs');
const userAgent = new UserAgent();
const regions = [
    { name: "Northwest", latMin: 45.5, latMax: 49, lngMin: -125, lngMax: -116.5, states: ["Washington", "Oregon", "Idaho", "Montana", "Wyoming"] },
    { name: "Southwest", latMin: 31, latMax: 36.5, lngMin: -123, lngMax: -114.5, states: ["California", "Nevada", "Arizona", "Utah", "Colorado", "New Mexico"] },
    { name: "Northeast", latMin: 39, latMax: 43, lngMin: -79, lngMax: -70.5, states: ["Maine", "New Hampshire", "Vermont", "Massachusetts", "Rhode Island", "Connecticut", "New York", "Pennsylvania", "New Jersey", "Delaware", "Maryland"] },
    { name: "Southeast", latMin: 25, latMax: 31, lngMin: -89, lngMax: -78, states: ["Virginia", "West Virginia", "North Carolina", "South Carolina", "Georgia", "Florida", "Alabama", "Mississippi", "Tennessee", "Kentucky", "Arkansas", "Louisiana"] },
    { name: "Midwest", latMin: 36, latMax: 49, lngMin: -104, lngMax: -82, states: ["Ohio", "Indiana", "Illinois", "Michigan", "Wisconsin", "Minnesota", "Iowa", "Missouri", "North Dakota", "South Dakota", "Nebraska", "Kansas"] },
    { name: "Texas-Oklahoma", latMin: 25, latMax: 37, lngMin: -106, lngMax: -93, states: ["Texas", "Oklahoma"] },
];

const statePopulationDensity = {
    "Alabama": 94.4,
    "Alaska": 1.3,
    "Arizona": 57.5,
    "Arkansas": 56.0,
    "California": 251.3,
    "Colorado": 52.6,
    "Connecticut": 738.1,
    "Delaware": 485.1,
    "Florida": 384.3,
    "Georgia": 177.0,
    "Hawaii": 214.1,
    "Idaho": 20.3,
    "Illinois": 230.0,
    "Indiana": 182.5,
    "Iowa": 55.5,
    "Kansas": 35.6,
    "Kentucky": 110.0,
    "Louisiana": 105.0,
    "Maine": 43.1,
    "Maryland": 618.8,
    "Massachusetts": 871.0,
    "Michigan": 174.8,
    "Minnesota": 68.9,
    "Mississippi": 63.5,
    "Missouri": 87.1,
    "Montana": 7.1,
    "Nebraska": 24.7,
    "Nevada": 26.3,
    "New Hampshire": 147.0,
    "New Jersey": 1210.1,
    "New Mexico": 17.2,
    "New York": 412.3,
    "North Carolina": 206.2,
    "North Dakota": 10.7,
    "Ohio": 282.3,
    "Oklahoma": 55.2,
    "Oregon": 40.3,
    "Pennsylvania": 284.3,
    "Rhode Island": 1016.3,
    "South Carolina": 162.9,
    "South Dakota": 11.3,
    "Tennessee": 157.8,
    "Texas": 105.2,
    "Utah": 36.5,
    "Vermont": 67.9,
    "Virginia": 210.8,
    "Washington": 107.0,
    "West Virginia": 73.8,
    "Wisconsin": 105.5,
    "Wyoming": 5.8
};

const statesWithDrop = {
    "Alabama": -6,
    "Arizona": -26,
    "Arkansas": -2,
    "Georgia": -20,
    "Illinois": -42,
    "Indiana": -12,
    "Louisiana": -15,
    "Michigan": -17,
    "Mississippi": -3,
    "Missouri": -16,
    "North Carolina": -26,
    "Ohio": -27,
    "South Carolina": -10,
    "South Dakota": -2,
    "Tennessee": -3,
    "Texas": 9,
    "Utah": -6,
    "Virginia": -22,
    "Washington": -2,
    "West Virginia": -2,
    "Wisconsin": -7
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getIncrementValue(region) {
    let totalDensity = 0;
    for (const state of region.states) {
        totalDensity += statePopulationDensity[state] || 0;
    }
    const avgDensity = totalDensity / region.states.length;
    if (avgDensity > 1000) return 0.04;   // Extremely high density
    if (avgDensity > 800) return 0.08;    // Extremely high density
    if (avgDensity > 700) return 0.1;    // Extremely high density
    if (avgDensity > 600) return 0.15;    // Extremely high density
    if (avgDensity > 500) return 0.2;     // Extremely high density
    if (avgDensity > 400) return 0.25;    // Extremely high density
    if (avgDensity > 375) return 0.3;     // High density
    if (avgDensity > 350) return 0.35;
    if (avgDensity > 325) return .4;
    if (avgDensity > 300) return .45;   // Very high density
    if (avgDensity > 275) return .5;
    if (avgDensity > 250) return .55;
    if (avgDensity > 225) return .6;
    if (avgDensity > 200) return .65;   // High density
    if (avgDensity > 175) return .7;
    if (avgDensity > 150) return .75;
    if (avgDensity > 125) return .8;
    if (avgDensity > 100) return .85;   // Medium-high density
    if (avgDensity > 75) return 1;
    if (avgDensity > 50) return 1.1;    // Medium density
    if (avgDensity > 20) return 1.3;    // Medium-low density
    return 2;                         // Low density
}

// Improved error handling and exponential backoff strategy
async function sendRequestWithBackoff(data, maxRetries = 3) {
    let retries = 0;
    const delay = (retries) => {
        return Math.pow(2, retries) * 100; // Exponential delay
    };

    while (retries < maxRetries) {
        try {
            console.log(`Sending request for latitude: ${data.latitude}, longitude: ${data.longitude}`);
            const response = await axios({
            method: 'POST',
            url: 'https://www.pylarify.com/api/location/search',
            timeout: 5000,
            headers: {
                'Language': 'en-US,en;q=0.5',
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
        console.log(`Received response for latitude: ${data.latitude}, longitude: ${data.longitude}:`, responseBody);

        if (responseBody && Object.keys(responseBody).length > 0) { // Adjust based on how 'no data' is represented
            return responseBody;
        } else {
            console.log(`No data for latitude: ${data.latitude}, longitude: ${data.longitude}`);
            return null;
        }
    } catch (error) {
        console.error(`Request failed (attempt ${retries + 1}):`, error.message);
        retries++;
        if (retries < maxRetries) {
            console.log(`Retrying in ${delay(retries)}ms`);
            await new Promise(resolve => setTimeout(resolve, delay(retries)));
        } else {
            console.error('Max retries reached. Request failed.');
            return { error: true, message: error.message }; // Indicating that an error occurred
        }
    }
}
}

async function processJsonFile(region, statesToInclude) {
    const results = [];

    const startTime = new Date();
    console.log(`Processing region ${region.name} (started at ${startTime.toISOString()})...`);

    const latitudes = [];
    const longitudes = [];

    // Adjusting request frequency and selective data retrieval
    const increment = getIncrementValue(region); // This function already seems to adjust based on some criteria

    for (let lat = region.latMin; lat <= region.latMax; lat += increment) {
        latitudes.push(lat.toFixed(1));
    }

    for (let lng = region.lngMin; lng <= region.lngMax; lng += increment) {
        longitudes.push(lng.toFixed(1));
    }

    // Enhanced error handling and logging
    for (const latitude of latitudes) {
        for (const longitude of longitudes) {
            const data = { latitude, longitude };

            if (statesToInclude.includes(region.name)) {
                // Increase the density of API requests for states with a drop
                const extraRequests = 20; // Adjust as needed
                for (let i = 0; i < extraRequests; i++) {
                    // Call the revised sendRequest function with backoff strategy
                    const result = await sendRequestWithBackoff(data); // Using the new function with backoff strategy
                    if (result && !result.error) {
                        results.push(result);
                        console.log(`Processed location: ${result.locationName}, Address: ${result.address1}, ${result.city}, ${result.state}, ${result.zip}`);
                    } else if (result && result.error) {
                        console.error(`Failed to get data for latitude: ${data.latitude}, longitude: ${data.longitude}`);
                    }
                    await sleep(500); // Adjust the sleep time as needed
                }
            } else {
                // For other states, use the revised sendRequest function with backoff strategy
                const resultArray = await sendRequestWithBackoff(data); // Using the new function with backoff strategy
                if (resultArray && !resultArray.error) {
                    results.push(...resultArray);
                    for(const result of resultArray) {
                    console.log(`Processed location: ${result.locationName}, Address: ${result.address1}, ${result.city}, ${result.state}, ${result.zip}`);
                    }
                } else if (resultArray && resultArray.error) {
                    console.error(`Failed to get data for latitude: ${data.latitude}, longitude: ${data.longitude}`);
                }
                await sleep(500); // Ensuring we don't overload server with requests
            }
        }
    }

    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000;
    console.log(`Finished processing region ${region.name} (took ${timeTaken.toFixed(2)} seconds).`);
    return results;
}

(async () => {
    const overallStartTime = new Date();
    console.log(`Overall process started at ${overallStartTime.toISOString()}`);

    const csvs = [];

    // Run processJsonFile for all the regions
    for (const region of regions) {
        const statesToInclude = statesWithDrop[region.name] > 0 ? [region.name] : [];
        const results = await processJsonFile(region, statesToInclude);
        csvs.push(...results);

        console.log(`Finished processing ${results.length} locations in ${region.name}`);
    }

    const overallEndTime = new Date();
    const overallTimeTaken = (overallEndTime - overallStartTime) / 1000;
    console.log(`Overall process finished (took ${overallTimeTaken.toFixed(2)} seconds).`);

    // Convert the results into CSV format
    console.log(`Total count of locations: ${csvs.length}`);
    const csvData = csvs.map((result) => {
        return Object.values(result).map(value => `"${value}"`).join(",");
    }).join("\n");
    console.log("CSV Data:", csvData);

    // Write the CSV data to a file
    fs.writeFileSync("siteLocator.csv", csvData);
})();
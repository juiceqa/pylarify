const UserAgent = require('user-agents');
const axios = require('axios');
const fs = require('fs');
const regionDensity = {};

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
    if (!regionDensity[region.name]) {
        let totalDensity = 0;
        for (const state of region.states) {
            totalDensity += statePopulationDensity[state] || 0;
        }
        regionDensity[region.name] = totalDensity / region.states.length; // Calculate once and store
    }

    const avgDensity = regionDensity[region.name];
    if (avgDensity > 1000) return 0.04;   // Extremely high density
    if (avgDensity > 800) return 0.08;    // Extremely high density
    if (avgDensity > 700) return 0.1;    // Extremely high density
    if (avgDensity > 600) return 0.15;    // Extremely high density
    if (avgDensity > 500) return 0.2;     // Extremely high density
    if (avgDensity > 400) return 0.25;    // Extremely high density
    if (avgDensity > 375) return 0.3;     // Very high density
    if (avgDensity > 350) return 0.35;    // Very high density
    if (avgDensity > 325) return .4;     // Very high density
    if (avgDensity > 300) return .45;   // Very high density
    if (avgDensity > 275) return .5;    // Very high density
    if (avgDensity > 250) return .55;   // Very high density
    if (avgDensity > 225) return .6;     // High density
    if (avgDensity > 200) return .65;   // High density
    if (avgDensity > 175) return .7;    // High density
    if (avgDensity > 150) return .75;   // High density
    if (avgDensity > 125) return .8;    // High density
    if (avgDensity > 100) return .85;   // Medium-high density
    if (avgDensity > 75) return 1;      // Medium-high density
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
            method: "POST",
            url: "https://www.pylarify.com/api/location/search",
            timeout: 5000,
            headers: {
                "Language": "en-US,en;q=0.5",
                "User-Agent": userAgent.toString(),
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,/;q=0.8",
                "Accept-Encoding": "gzip, deflate",
                "Content-Type": "application/json",
                "cookie": "_gcl_au=1.1.1539027924.1666903935; _fbp=fb.1.1666903934945.437512069; _ga_DNCFS6ZVQ7=GS1.1.1667005436.3.0.1667005436.0.0.0; _ga=GA1.2.1253772167.1666903935; _gid=GA1.2.618103297.1667005437; _gat_UA-175193909-2=1",
                "Origin": "https://www.pylarify.com",
                "Connection": "close",
                "Referer": "https://www.pylarify.com/site-locator",
                "X-Forwarded-For": "127.0.0.1"
            },
            data: data,
        });
        const responseBody = response.data;
        console.log(`Received response for latitude: ${data.latitude}, longitude: ${data.longitude}:`, responseBody);

        if (responseBody && Object.keys(responseBody).length > 0) { // Adjust based on how "no data" is represented
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
            console.error("Max retries reached. Request failed.");
            return { error: true, message: error.message }; // Indicating that an error occurred
        }
    }
}
}

const missingLocationsData = {
    "44106": 4, "90211": 4, "95816": 3, "23188": 2, "28204": 2, "30322": 2, "90033": 2, "75093": 2, "23320": 2, "30033": 2, "85297": 2, "60126": 2, "90301": 2, "27518": 2, "85712": 2, "92868": 2, "94305": 2, "30342": 2, "84790": 2, "92618": 2, "95661": 2, "30606": 2, "8857": 1, "8831": 1, "7728": 1, "27320": 1, "88011": 1, "10065": 1, "89511": 1, "89502": 1, "10021": 1, "14623": 1, "45069": 1, "45409": 1, "45429": 1, "43222": 1, "43213": 1, "44446": 1, "27514": 1, "27157": 1, "27262": 1, "27103": 1, "27607": 1, "55102": 1, "63367": 1, "65201": 1, "39202": 1, "39213": 1, "28602": 1, "28401": 1, "28358": 1, "28374": 1, "28561": 1, "27609": 1, "28105": 1, "27284": 1, "27705": 1, "27708": 1, "28215": 1, "28203": 1, "28147": 1, "28208": 1, "28078": 1, "28677": 1, "44307": 1, "27216": 1, "27403": 1, "43952": 1, "35401": 1, "44304": 1, "23708": 1, "84112": 1, "84041": 1, "84403": 1, "24301": 1, "24153": 1, "24014": 1, "23666": 1, "23502": 1, "22060": 1, "22401": 1, "23434": 1, "23456": 1, "23435": 1, "44125": 1, "24541": 1, "24112": 1, "23860": 1, "23249": 1, "23235": 1, "23219": 1, "23226": 1, "23229": 1, "23230": 1, "23116": 1, "5401": 1, "98055": 1, "84106": 1, "84107": 1, "84604": 1, "77098": 1, "44128": 1, "44109": 1, "48154": 1, "44060": 1, "73104": 1, "97504": 1, "15301": 1, "15243": 1, "15009": 1, "15212": 1, "15213": 1, "29505": 1, "29720": 1, "29621": 1, "29605": 1, "29607": 1, "29650": 1, "29303": 1, "29220": 1, "29210": 1, "29169": 1, "37232": 1, "75243": 1, "77030": 1, "76508": 1, "55060": 1, "70737": 1, "4412": 1, "95350": 1, "85234": 1, "85206": 1, "85258": 1, "85251": 1, "85050": 1, "85054": 1, "85032": 1, "85016": 1, "93306": 1, "93720": 1, "93710": 1, "95655": 1, "85006": 1, "95630": 1, "95608": 1, "95695": 1, "95687": 1, "91355": 1, "90017": 1, "94568": 1, "94609": 1, "94705": 1, "94143": 1, "94109": 1, "85004": 1, "85284": 1, "94015": 1, "85501": 1, "35233": 1, "35205": 1, "35235": 1, "35903": 1, "71913": 1, "86001": 1, "86314": 1, "86326": 1, "86336": 1, "85711": 1, "85719": 1, "85901": 1, "85224": 1, "85120": 1, "92408": 1, "85374": 1, "85351": 1, "85338": 1, "85381": 1, "85395": 1, "85308": 1, "85304": 1, "85306": 1, "85012": 1, "94546": 1, "94121": 1, "4330": 1, "60477": 1, "30115": 1, "30041": 1, "30303": 1, "30501": 1, "30097": 1, "30046": 1, "30474": 1, "30901": 1, "30912": 1, "30905": 1, "30909": 1, "60048": 1, "30060": 1, "60540": 1, "60035": 1, "60453": 1, "60463": 1, "41017": 1, "35406": 1, "70403": 1, "1844": 1, "20678": 1, "20610": 1, "4074": 1, "30308": 1, "30214": 1, "94507": 1, "92623": 1, "94597": 1, "94523": 1, "94903": 1, "95482": 1, "95405": 1, "94558": 1, "90241": 1, "90048": 1, "90034": 1, "92653": 1, "92604": 1, "94301": 1, "30277": 1, "80907": 1, "80920": 1, "80045": 1, "81505": 1, "81501": 1, "81601": 1, "80401": 1, "80228": 1, "80210": 1, "33461": 1, "33028": 1, "54868": 1
};

function adjustLatLongForZipCode(latitude, longitude, zipCode, region) {
    // If the zip code is not in the missing list, we don't adjust
    if (!missingLocationsData.hasOwnProperty(zipCode)) {
        return { latitude, longitude };
    }

    const occurrences = missingLocationsData[zipCode];
    let tierAdjustment = 0;

    // Adjusting the tier based on the number of occurrences
    if (occurrences === 1) {
        tierAdjustment = 2; // move up two tiers
    } else if (occurrences === 2) {
        tierAdjustment = 3; // move up three tiers
    } else if (occurrences >= 3) {
        tierAdjustment = 4; // move up four tiers
    }

    // Calculate the original increment based on density
    let originalIncrement = getIncrementValue(region);

    // Function to adjust the increment based on tier adjustment
    // This function needs to access your density-to-increment mapping, which seems complex.
    // For simplicity, I'm illustrating a hypothetical function, but you need to adjust it according to your actual tiers.
    const adjustIncrementForTier = (increment, tierAdjustment) => {
        // Here, you'd have logic that, based on your specific increments and tiers,
        // would adjust the increment value. This is a simplified representation.
        const densityTiers = [2, 1.3, 1.1, 1, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1, 0.08, 0.04];

        // Find the current tier
        const currentTierIndex = densityTiers.findIndex(tier => tier === increment);
        if (currentTierIndex === -1) return increment; // not found, no adjustment

        // Calculate the new tier index
        const newTierIndex = currentTierIndex - tierAdjustment;
        if (newTierIndex < 0) return densityTiers[0]; // if we exceed the highest tier, return the highest possible increment

        return densityTiers[newTierIndex]; // return the adjusted increment from the tiers
    };

    // Adjust the increment
    const adjustedIncrement = adjustIncrementForTier(originalIncrement, tierAdjustment);

    // Now, we apply the adjusted increment
    // I assume the increment affects how much we "move" from the original latitude and longitude.
    // The actual effect of the increment on latitude and longitude might be different in your case and needs adjustment.
    const newLatitude = latitude + adjustedIncrement;
    const newLongitude = longitude + adjustedIncrement; // If the adjustment is different for lat and long, modify here.

    return {
        latitude: newLatitude,
        longitude: newLongitude
    };
}


// Writing results directly to the file instead of storing in an array
function writeResultToFile(result) {
    // Convert the result object to CSV format here
    const csvLine = Object.values(result).map(value => `"${value}"`).join(",") + "\n";

    // Append the result to the file
    fs.appendFileSync("siteLocator.csv", csvLine, (err) => {
        if (err) {
            console.error("Error writing to file", err);
        }
    });
}


async function processJsonFile(region, statesToInclude) {
    const results = [];
    const axios = require('axios');  // Make sure to import at the start of your file
    const startTime = new Date();
    console.log(`Processing region ${region.name} (started at ${startTime.toISOString()})...`);

    const latitudes = [];
    const longitudes = [];

    const increment = getIncrementValue(region);

    for (let lat = region.latMin; lat <= region.latMax; lat += increment) {
        latitudes.push(lat.toFixed(1));
    }

    for (let lng = region.lngMin; lng <= region.lngMax; lng += increment) {
        longitudes.push(lng.toFixed(1));
    }

    const missingLocationsData = {}; // Assume this is your object with missing data, structured as { zipCode: data }

    for (const zipCode in missingLocationsData) {
        if (missingLocationsData.hasOwnProperty(zipCode)) {
            const response = await axios.get(`http://api.geonames.org/postalCodeSearchJSON?postalcode=${zipCode}&maxRows=10&username=juiceqa`);
            if (response.data && response.data.postalCodes && response.data.postalCodes.length > 0) {
                const { lat, lng } = response.data.postalCodes[0];
                missingLocationsData[zipCode] = { latitude: lat, longitude: lng };
            } else {
                console.error(`No data returned for ZIP code: ${zipCode}`);
            }
        }
    }

    for (const latitude of latitudes) {
        for (const longitude of longitudes) {
            let data = { latitude, longitude };

            for (const zipCode in missingLocationsData) {
                if (missingLocationsData.hasOwnProperty(zipCode) && missingLocationsData[zipCode]) {
                    data = adjustLatLongForZipCode(data.latitude, data.longitude, zipCode, region);
                }
            }

            if (statesToInclude.includes(region.name)) {
                const extraRequests = 20;
                for (let i = 0; i < extraRequests; i++) {
                    const result = await sendRequestWithBackoff(data);
                    if (result && !result.error) {
                        writeResultToFile(result);
                        console.log(`Processed location: ${result.locationName}, Address: ${result.address1}, ${result.city}, ${result.state}, ${result.zip}`);
                    } else if (result && result.error) {
                        console.error(`Failed to get data for latitude: ${data.latitude}, longitude: ${data.longitude}`);
                    }
                    await sleep(500);
                }
            } else {
                const resultArray = await sendRequestWithBackoff(data);
                if (resultArray && !resultArray.error) {
                    results.push(...resultArray);
                    for (const result of resultArray) {
                        console.log(`Processed location: ${result.locationName}, Address: ${result.address1}, ${result.city}, ${result.state}, ${result.zip}`);
                    }
                } else if (resultArray && resultArray.error) {
                    console.error(`Failed to get data for latitude: ${data.latitude}, longitude: ${data.longitude}`);
                }
                await sleep(500);
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
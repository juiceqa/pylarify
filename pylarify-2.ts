// @ts-nocheck
const fs = require('fs');
const csv = require('csv-parser');
const UserAgent = require('user-agents');
const axios = require('axios');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Papa = require('papaparse');
const logger = require('./logger');

const userAgent = new UserAgent();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function populateDensityFromCSV(csvFilePath) {
    try {
        const csvData = fs.readFileSync(csvFilePath, 'utf8');
        const cityDensityMap = {};
        const parsed = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
        });

        for (const row of parsed.data) {
            const cityName = row['city'];
            const density = row['density'];
            if (cityName && density) {
                cityDensityMap[cityName] = density;
            }
        }
        return cityDensityMap;
    } catch (error) {
        logger.error(`Error in populateDensityFromCSV: ${error.message}`);
        throw error;
    }
}

async function getIncrementValue(cityDensity) {
    logger.info(`Entering getIncrementValue with cityDensity: ${cityDensity}`);
    let incrementValue;

    if (cityDensity <= 0) incrementValue = 1;    // Extremely high density
    else if (cityDensity > 25000) incrementValue = 0.01;
    else if (cityDensity > 20000) incrementValue = 0.015;
    else if (cityDensity > 18000) incrementValue = 0.02;
    else if (cityDensity > 16000) incrementValue = 0.025;
    else if (cityDensity > 14000) incrementValue = 0.03;
    else if (cityDensity > 12000) incrementValue = 0.035;
    else if (cityDensity > 10000) incrementValue = 0.04;
    else if (cityDensity > 9000) incrementValue = 0.045;
    else if (cityDensity > 8000) incrementValue = 0.05;
    else if (cityDensity > 7000) incrementValue = 0.055;
    else if (cityDensity > 6000) incrementValue = 0.06;
    else if (cityDensity > 5500) incrementValue = 0.065;
    else if (cityDensity > 5000) incrementValue = 0.07;
    else if (cityDensity > 4500) incrementValue = 0.075;
    else if (cityDensity > 4000) incrementValue = 0.08;
    else if (cityDensity > 3500) incrementValue = 0.085;
    else if (cityDensity > 3000) incrementValue = 0.09;
    else if (cityDensity > 2500) incrementValue = 0.1;
    else if (cityDensity > 2000) incrementValue = 0.12;
    else if (cityDensity > 1500) incrementValue = 0.14;
    else if (cityDensity > 1000) incrementValue = 0.16;
    else if (cityDensity > 800) incrementValue = 0.2;
    else if (cityDensity > 600) incrementValue = 0.3;
    else if (cityDensity > 400) incrementValue = 0.4;
    else if (cityDensity > 200) incrementValue = 0.5;
    else if (cityDensity > 100) incrementValue = 1;
    else incrementValue = 1;

    logger.info(`Exiting getIncrementValue with incrementValue: ${incrementValue}`);
    return incrementValue;
}


// Improved error handling and exponential backoff strategy
async function sendRequestWithBackoff({ data, maxRetries = 3 }) {
    logger.info(`Entering sendRequestWithBackoff with data: ${JSON.stringify(data)} and maxRetries: ${maxRetries}`);
    let retries = 0;
    const delay = (retries) => Math.pow(2, retries) * 100;
    const headers = {
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
    }
    while (retries < maxRetries) {
        try {
            const response = await axios({
                method: "POST",
                url: "https://www.pylarify.com/api/location/search",
                timeout: 5000,
                headers: headers,
                data: data,
            });
            const responseBody = response.data;
            if (responseBody && Object.keys(responseBody).length > 0) {
                logger.info(`Successful API response received in sendRequestWithBackoff: ${JSON.stringify(responseBody)}`);
                return responseBody;
            } else {
                logger.warn("API returned an empty or undefined response in sendRequestWithBackoff.");
                return null;
            }
        } catch (error) {
            retries++;
            logger.error(`API request failed in sendRequestWithBackoff. Retry count: ${retries}. Error: ${error.message}`);
            if (retries < maxRetries) {
                await sleep(delay(retries));
            } else {
                logger.error(`Max retries reached in sendRequestWithBackoff. Returning error: ${error.message}`);
                return { error: true, message: error.message };
            }
        }
    }
}

// Modified function to correctly format the data for CSV and handle missing values
async function writeResultToFile(result) {
    logger.info(`Entering writeResultToFile with result: ${JSON.stringify(result)}`);

    // Check if the result is an array of objects
    if (!Array.isArray(result) || result.some(item => typeof item !== 'object')) {
        logger.error("Data passed to writeResultToFile is not in the expected format (array of objects).");
        return;
    }

    const csvLines = result.map(row => {
        const flattenedRow = {};  // To store the flattened structure
        for (const [key, value] of Object.entries(row)) {
            // If the value is an object, flatten it
            if (typeof value === 'object' && value !== null) {
                for (const [subKey, subValue] of Object.entries(value)) {
                    flattenedRow[`${key}_${subKey}`] = subValue;
                }
            } else {
                flattenedRow[key] = value || "";  // Use an empty string if value is null or undefined
            }
        }

        const values = Object.values(flattenedRow);
        const quotedValues = values.map(value => `"${value}"`);
        return quotedValues.join(",");
    });

    // Convert array to a string and append a new line at the end
    const csvData = csvLines.join("\n") + "\n";
    fs.appendFileSync("10-2023.csv", csvData);
    logger.info("Exiting writeResultToFile, data written to 10-2023.csv");
}

async function runComparisonScript({}) {
    logger.info("Entering runComparisonScript");
    try {
        const { stdout, stderr } = await exec('python3 compare-reports.py');
        logger.info("Exiting runComparisonScript");
        return stdout;
    } catch (error) {
        logger.error(`Error in runComparisonScript: ${error.message}`);
        throw error;
    }
}


async function readMissingCities({}) {
    logger.info("Entering readMissingCities");
    try {
        const missingCities = {};
        return new Promise((resolve, reject) => {
      fs.createReadStream('location_changes.csv')
        .pipe(csv())
        .on('data', (row) => {
          if (row['status'] === 'Closed') {
            const city = row['city'];
            // If the city is already in the map, increment the counter, otherwise initialize it to 1
            missingCities[city] = (missingCities[city] || 0) + 1;
          }
        })
        .on('end', () => {
          resolve(missingCities);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
} catch (error) {
    logger.error("Error reading missing cities: ", error);
    throw error;
}
}
async function locateMissingCities(missingCities) {
    logger.info(`Entering locateMissingCities with missingCities: ${JSON.stringify(missingCities)}`);
    const cityLocations = {};
    return new Promise((resolve, reject) => {
        fs.createReadStream('uscities.csv')
            .pipe(csv())
            .on('data', (row) => {
                if (missingCities.hasOwnProperty(row.city)) {
                    cityLocations[row.city] = { latitude: parseFloat(row.lat), longitude: parseFloat(row.lng) };
                    logger.info(`Located missing city: ${row.city}, latitude: ${row.lat}, longitude: ${row.lng}`);
                }
            })
            .on('end', () => {
                logger.info(`locateMissingCities completed. Returning cityLocations: ${JSON.stringify(cityLocations)}`);
                resolve(cityLocations);
            })
            .on('error', (error) => {
                logger.error(`An error occurred in locateMissingCities: ${error.message}`);
                reject(error);
            });
    });
}

async function adjustLatLongForMissingCities(cityLocations, missingCities) {
    logger.info("Entering adjustLatLongForMissingCities");
    const cityDensityMap = await populateDensityFromCSV('uscities.csv');
    const adjustedLocations = {};

    for (const city in cityLocations) {
        const cityData = cityLocations[city];
        if (cityData) {
            const cityDensity = cityDensityMap[city] || 0;
            const increment = await getIncrementValue(cityDensity);

            if (increment) {
                const { latitude, longitude } = cityData;
                adjustedLocations[city] = {
                    latitude: latitude + increment,
                    longitude: longitude + increment
                };
            } else {
                logger.warn(`Increment value is undefined for ${city}`);
            }
        } else {
            logger.warn(`City data is undefined for ${city}`);
        }
    }
    logger.info("Exiting adjustLatLongForMissingCities with adjustedLocations:", JSON.stringify(adjustedLocations));
    return adjustedLocations;
}

async function adjustLatLongForAllCities(allCityLocations) {
    logger.info("Entering adjustLatLongForAllCities");
    const cityDensityMap = await populateDensityFromCSV('uscities.csv');
    const allAdjustedLocations = {};

    for (const city in allCityLocations) {
        const cityData = allCityLocations[city];
        if (cityData) {
            const cityDensity = cityDensityMap[city] || 0;
            const increment = await getIncrementValue(cityDensity);

            if (increment) {
                const { latitude, longitude } = cityData;
                allAdjustedLocations[city] = {
                    latitude: latitude + increment,
                    longitude: longitude + increment
                };
            } else {
                logger.warn(`Increment value is undefined for ${city}`);
            }
        } else {
            logger.warn(`City data is undefined for ${city}`);
        }
    }
    logger.info("Exiting locateAllCities with allCityLocations:", JSON.stringify(allCityLocations));
    return allAdjustedLocations;
}

async function runFinalComparison(adjustedLocations) {
    const additionalResults = [];
    let lastProcessedCity = null;
    try {
        const savedState = require('./state.json');
        lastProcessedCity = savedState.lastProcessedCity;
    } catch (err) {
        logger.error("No saved state found.");
    }
    let processCity = lastProcessedCity ? false : true;

    for (const city in adjustedLocations) {
        if (!processCity && city === lastProcessedCity) {
            processCity = true;
        }
        if (processCity) {
            const cityData = adjustedLocations[city];
            if (cityData) {
                const { latitude, longitude } = cityData;
                const data = { latitude, longitude }; // Add other required fields if necessary

                try {
                    const result = await sendRequestWithBackoff({ data });
                    if(result) {
                        logger.info("Got result from API", result);
                        additionalResults.push(...result);

                        fs.writeFileSync('./state.json', JSON.stringify({ lastProcessedCity: city }));
                    } else {
                        logger.warn("Got empty result from API for city", city);
                    }
                } catch (error) {
                    logger.error(`Failed to fetch data for ${city}: ${error}`);
                }
            }
        }
    }
    return additionalResults;
}

async function recheckClosedCities(missingCities, cityLocations) {
    logger.info("Entering recheckClosedCities");
    const adjustedLocations = await adjustLatLongForMissingCities(cityLocations, missingCities);
    if (adjustedLocations) {
        logger.info("adjustedLocations for closed cities is populated:", adjustedLocations);
    } else {
        logger.warn("adjustedLocations for closed cities is empty or undefined");
    }

    logger.info("About to run runFinalComparison for closed cities");
    const finalComparisonResults = await runFinalComparison(adjustedLocations);
    logger.info("Finished running runFinalComparison for closed cities");

    if (finalComparisonResults && finalComparisonResults.length > 0) {
        logger.info("finalComparisonResults for closed cities is populated:", finalComparisonResults);
        await writeResultToFile(finalComparisonResults);
    } else {
        logger.error("finalComparisonResults for closed cities is empty or undefined");
    }
    logger.info("Exiting recheckClosedCities");
}

async function locateAllCities() {
    const allCityLocations = {};
    return new Promise((resolve, reject) => {
        fs.createReadStream('uscities.csv')
            .pipe(csv())
            .on('data', (row) => {
                allCityLocations[row.city] = { latitude: parseFloat(row.lat), longitude: parseFloat(row.lng) };
            })
            .on('end', () => {
                resolve(allCityLocations);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}


(async () => {
    try {
        logger.info("About to run runComparisonScript");
        await runComparisonScript({});
        logger.info("Finished running runComparisonScript");

        const missingCities = await readMissingCities({});
        if (missingCities) {
            logger.info("missingCities is populated:", missingCities);
        } else {
            logger.warn("missingCities is empty or undefined");
        }

        const cityLocations = await locateMissingCities(missingCities);
        if (cityLocations) {
            logger.info("cityLocations is populated:", cityLocations);
        } else {
            logger.warn("cityLocations is empty or undefined");
        }

        await recheckClosedCities(missingCities, cityLocations);
        const adjustedLocations = await adjustLatLongForMissingCities(cityLocations, missingCities);
        if (adjustedLocations) {
            logger.info("adjustedLocations is populated:", adjustedLocations);
        } else {
            logger.warn("adjustedLocations is empty or undefined");
        }

        logger.info("About to run runFinalComparison");
        const finalComparisonResults = await runFinalComparison(adjustedLocations);
        logger.info("Finished running runFinalComparison");

        if (finalComparisonResults && finalComparisonResults.length > 0) {
            logger.info("finalComparisonResults is populated:", finalComparisonResults);
            await writeResultToFile(finalComparisonResults);
        } else {
            logger.error("finalComparisonResults is empty or undefined");
        }
        const allCityLocations = await locateAllCities();
        const allAdjustedLocations = await adjustLatLongForAllCities(allCityLocations);
        const allFinalComparisonResults = await runFinalComparison(allAdjustedLocations);
        const combinedResults = [...finalComparisonResults, ...allFinalComparisonResults];
        if (combinedResults && combinedResults.length > 0) {
            await writeResultToFile(combinedResults);
        } else {
            logger.error("Both finalComparisonResults and allFinalComparisonResults are empty or undefined");
        }

    } catch (error) {
        logger.error(`An error occurred: ${error}`);
    }
})();

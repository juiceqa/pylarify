const axios = require('axios');
const { createObjectCsvWriter } = require('csv-writer');


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

const data = require("../../../fixtures/set16.json");

async function printLocations() {
    const results = [];
    for (let i = 0; i < data.length; i++) {
        const response = await axios.post('https://www.pylarify.com/api/location/search', data[i], {
            headers: {
                'Language': 'Language: en-US,en;q=0.$5$',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,/;q=0.8',
                'Accept-Encoding': 'gzip, deflate',
                'cookie': '_gcl_au=1.1.1539027924.1666903935; _fbp=fb.1.1666903934945.437512069; _ga_DNCFS6ZVQ7=GS1.1.1667005436.3.0.1667005436.0.0.0; _ga=GA1.2.1253772167.1666903935; _gid=GA1.2.618103297.1667005437; _gat_UA-175193909-2=1',
                'Content-Type': 'application/json',
                'Origin': 'https://www.pylarify.com',
                'Connection': 'close',
                'Referer': 'https://www.pylarify.com/site-locator',
                'X-Forwarded-For': '127.0.0.1',
            },
        });
        const responseBody = response.data;
        const locationName = responseBody.locationName || null;
        const centerType = responseBody.centerType || null;
        const address1 = responseBody.address1 || null;
        const address2 = responseBody.address2 || null;
        const city = responseBody.city || null;
        const state = responseBody.state || null;
        const zip = responseBody.zip || null;
        const phoneNumber = responseBody.phoneNumber || null;
        const phoneExtension = responseBody.phoneExtension || null;
        const websiteUrl = responseBody.websiteUrl || null;
        const treatmentCenterId = responseBody.treatmentCenterId || null;
        const latitude = responseBody.latitude || null;
        const longitude = responseBody.longitude || null;
        const createdDtTm = responseBody.createdDtTm || null;
        const modifiedDtTm = responseBody.modifiedDtTm || null;

        results.push({
            locationName,
            centerType,
            address1,
            address2,
            city,
            state,
            zip,
            phoneNumber,
            phoneExtension,
            websiteUrl,
            treatmentCenterId,
            latitude,
            longitude,
            createdDtTm,
            modifiedDtTm,
        });
    }

    return results;
}

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

async function main() {
    let allResults = [];
    for (let i = 1; i <= 16; i++) {
        const data = require(`./fixtures/${i}.json`);
        const results = await printLocations(data);
        allResults.push(...results);
    }
    const uniqueResults = removeDuplicates(allResults);
    await csvWriter.writeRecords(uniqueResults);
    console.log('CSV file has been written successfully.');
}

main().catch(console.error);
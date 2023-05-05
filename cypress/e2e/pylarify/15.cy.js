// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/* eslint-disable no-undef */
/* eslint-disable semi */
/// <reference types="cypress" />
import UserAgent from 'user-agents';
const userAgent = new UserAgent();
const testData = require("./fixtures/15.json")
Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})
const csvs = []

describe("Site Locator", () => {
    testData.forEach((data) => {

        it("prints locations", function() {
            cy.wait(150)
            cy.request({
                    method: 'POST',
                    url: 'https://www.pylarify.com/api/location/search',
                    headers: {
                        //   'x-mock-response-name': 'pylarify',
                        'Language': 'Language: en-US,en;q=0.$5$',
                        'User-Agent': userAgent,
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,/;q=0.8',
                        'Accept-Encoding': 'gzip, deflate',
                        'cookie': '_gcl_au=1.1.1539027924.1666903935; _fbp=fb.1.1666903934945.437512069; _ga_DNCFS6ZVQ7=GS1.1.1667005436.3.0.1667005436.0.0.0; _ga=GA1.2.1253772167.1666903935; _gid=GA1.2.618103297.1667005437; _gat_UA-175193909-2=1',
                        'Content-Type': 'application/json',
                        'Origin': 'https://www.pylarify.com',
                        'Connection': 'close',
                        'Referer': 'https://www.pylarify.com/site-locator',
                        //    'Token': '**Token**&utf8=%E2%9C%93&user%5email%5D=YOUR_EMAIL@example.com%00&%00commit=Send',
                        'X-Forwarded-For': '127.0.0.1'
                    },
                    body: data

                })
                .its("body")
                .each((responseBody) => {
                    const locationName = responseBody.locationName || null
                    const centerType = responseBody.centerType || null
                    const address1 = responseBody.address1 || null
                    const address2 = responseBody.address2 || null
                    const city = responseBody.city || null
                    const state = responseBody.state || null
                    const zip = responseBody.zip || null
                    const phoneNumber = responseBody.phoneNumber || null
                    const phoneExtension = responseBody.phoneExtension || null
                    const websiteUrl = responseBody.websiteUrl || null
                    const treatmentCenterId = responseBody.treatmentCenterId || null
                    const latitude = responseBody.latitude || null
                    const longitude = responseBody.longitude || null
                    const createdDtTm = responseBody.createdDtTm || null
                    const modifiedDtTm = responseBody.modifiedDtTm || null

                    csvs.push({
                        locationName: locationName,
                        centerType: centerType,
                        address1: address1,
                        address2: address2,
                        city: city,
                        state: state,
                        zip: zip,
                        phoneNumber: phoneNumber,
                        phoneExtension: phoneExtension,
                        websiteUrl: websiteUrl,
                        treatmentCenterId: treatmentCenterId,
                        latitude: latitude,
                        longitude: longitude,
                        createdDtTm: createdDtTm,
                        modifiedDtTm: modifiedDtTm
                    })
                })
        })
    })
    it("writes csv file", function() {
        cy.task(
            "writeCsvFile", { filename: "siteLocator15.csv", data: csvs },
            csvs.join("\n")
        )
    })
})
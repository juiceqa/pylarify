// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/* eslint-disable no-undef */
/* eslint-disable semi */
/// <reference types="cypress" />
const testData = require("../fixtures/bounds.json")
Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;

});

describe('Site Locator', () => {
    const csvs = [];

    testData.forEach((testData) => {

        it('prints locations', function() {
            cy.log('data is:' + testData)
            cy.request({
                method: 'POST',
                url: '/api/location/search',
                body: testData,
                failOnStatusCode: false,
                headers: {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "content-type": "application/json",
                    "cookie": "_gcl_au=1.1.141273296.1659646726; _gid=GA1.2.1508085124.1660660404; _ga_DNCFS6ZVQ7=GS1.1.1660752923.8.0.1660752923.0.0.0; _ga=GA1.2.2046703877.1659646726; _gat_UA-175193909-2=1; cookie-policy=Fri%20Sep%2016%202022%2010:15:32%20GMT-0600%20(Mountain%20Daylight%20Time)",
                    'User-Agent': 'Googlebot-News',
                    "Host": "www.pylarify.com",
                    "Referer": "https://www.pylarify.com/site-locator",
                    "sec-fetch-mode": "cors",
                    "x-requested-with": "XMLHttpRequest"
                },
            }).its('body').then((responseBody) => {
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
        });
    })
    it('writes csv file', function() {
        cy.task(
            "writeCsvFile", { filename: "siteLocator.csv", data: csvs },
            csvs.join("\n")
        );
    })
})
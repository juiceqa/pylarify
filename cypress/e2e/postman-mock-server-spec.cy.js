// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/* eslint-disable no-undef */
/* eslint-disable semi */
/// <reference types="cypress" />
const testData = require("../fixtures/set16.json")
Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;

});

describe('Site Locator', () => {
    const csvs = [];

    testData.forEach((data) => {

        it('prints locations', function() {
            cy.intercept({
                method: 'GET',
                url: 'https://217c7915-6d0a-4cfe-b967-80a36bc35675.mock.pstmn.io/',
            }).as('getMock');
            cy.log('data is:' + data)
            cy.request({
                method: 'POST',
                url: 'https://217c7915-6d0a-4cfe-b967-80a36bc35675.mock.pstmn.io/',
                failOnStatusCode: false
            }).its('body').each((responseBody) => {
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
            "writeCsvFile", { filename: "siteLocator16.csv", data: csvs },
            csvs.join("\n")
        );
    })
})
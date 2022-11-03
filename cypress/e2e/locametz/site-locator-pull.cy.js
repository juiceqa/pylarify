// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/* eslint-disable no-undef */
/* eslint-disable semi */
/// <reference types="cypress" />
import UserAgent from 'user-agents';
const userAgent = new UserAgent();
Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})
const csvs = []

describe("Site Locator", () => {

    it("prints Locametz locations", function() {
        cy.wait(150)
        cy.request({
                method: "GET",
                url: "https://www.hcp.novartis.com/locationfinderblock/findmarkers/145918/39.7271021/-104.9564084/0/all/",
                headers: {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    'User-Agent': userAgent,
                    "accept-language": "en,en-US;q=0.9",
                    "request-context": "appId=cid-v1:fbded6d8-2f5c-4cb0-adf7-2ae9d814644f",
                    "request-id": "|DoKQr.UgHiZ",
                    "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                    "cookie": "ASP.NET_SessionId=ydc1apiz3dn1kmgqqupyfuuk; __RequestVerificationToken=OVCCxuwFtRd4UAA9cpZWnczcMTiF1p9J5KUNwoFAL4ij0xtuoROXQRtJhuWgMhpJZRLK25_zh_j662xiXJ2ZSnVy6YT3TGPC5xdrqd3t3pI1; ARRAffinity=619f09957c32de59b5088c218078151258f6aee0cd5c7a86d05f1702ff4dba85; ARRAffinitySameSite=619f09957c32de59b5088c218078151258f6aee0cd5c7a86d05f1702ff4dba85; ai_user=AOzvG|2022-11-03T14:28:19.164Z; _gcl_au=1.1.133764024.1667485699; ai_session=CjS8c|1667485699494.9|1667485699494.9; siponimod=SiponimodWebsite; _gid=GA1.2.242860304.1667485700; _gat_UA-135907693-106=1; is=b31753ba-45fb-4d4f-a6cd-55317c275248; iv=f360167a-2216-4617-8614-722a07c1c33a; _fbp=fb.1.1667485701355.931144436; _ga=GA1.2.1554927805.1667485700; _uetsid=c381bac05b8311edb05dbb5b8bb2fb5b; _uetvid=c3822bc05b8311ed9a532be566d5aaa6; _ga_ZZ95MFZD1W=GS1.1.1667485699.1.1.1667485742.17.0.0",
                    'Connection': 'close',
                    "Referer": "https://www.us.pluvicto.com/treatment-center-locator/",
                    'X-Forwarded-For': '127.0.0.1',
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": null,
            })
            .its("body")
            .each((responseBody) => {
                const Center = responseBody.Center || null
                const Address = responseBody.Address || null
                const City = responseBody.City || null
                const State = responseBody.State || null
                const ZIP = responseBody.ZIP || null
                const ContactPerson = responseBody.ContactPerson || null
                const PhoneNumberPrefix = responseBody.PhoneNumberPrefix || null
                const PhoneNumber = responseBody.PhoneNumber || null
                const PhoneNumber2Prefix = responseBody.PhoneNumber2Prefix || null
                const PhoneNumber2 = responseBody.PhoneNumber2 || null
                const Website = responseBody.Website || null
                const CertificationStatus = responseBody.CertificationStatus || null
                const Latitude = responseBody.Latitude || null
                const Longitude = responseBody.Longitude || null
                const order = responseBody.order || null

                csvs.push({
                    order: order,
                    Center: Center,
                    Address: Address,
                    City: City,
                    State: State,
                    ZIP: ZIP,
                    ContactPerson: ContactPerson,
                    PhoneNumberPrefix: PhoneNumberPrefix,
                    PhoneNumber: PhoneNumber,
                    PhoneNumber2Prefix: PhoneNumber2Prefix,
                    PhoneNumber2: PhoneNumber2,
                    Website: Website,
                    CertificationStatus: CertificationStatus,
                    Latitude: Latitude,
                    Longitude: Longitude,

                })
            })
    })
    it("writes csv file", function() {
        cy.task(
            "writeCsvFile", { filename: "locametz-site-locator.csv", data: csvs },
            csvs.join("\n")
        )
    })
})
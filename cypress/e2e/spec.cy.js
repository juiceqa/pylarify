// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

describe('Example Cypress TodoMVC test', () => {
    ~~

    it('adds 2 todos', function() {
        cy.visit('/site-locator')
        cy.fixture('example').as('example')
        cy.get('@example').then((example) => {
            cy.request({
                method: 'POST',
                url: '/api/location/search',
                body: example,
                failOnStatusCode: false,
                headers: {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "content-type": "application/json; charset=UTF-8",
                    "cookie": "_gcl_au=1.1.141273296.1659646726; _gid=GA1.2.1711352227.1660136473; cookie-policy=Fri%20Sep%2009%202022%2007:01:15%20GMT-0600%20(Mountain%20Daylight%20Time); _ga=GA1.2.2046703877.1659646726; _ga_DNCFS6ZVQ7=GS1.1.1660136473.3.1.1660136741.0; _gat_UA-175193909-2=1",
                    "Referer": "https://www.pylarify.com/site-locator"
                },
            }).should((response) => {
                cy.log(JSON.stringify(response.headers))
                cy.log(JSON.stringify(response.body))
            })
        })
    })
})

[{
        "address1": "1800 North Williams St",
        "address2": "Suite 100 ",
        "city": "Denver",
        "state": "CO",
        "zip": "80218",
        "phoneNumber": "779-227-4864",
        "phoneExtension": null,
        "locationName": "Rocky Mountain Cancer Center - Midtown",
        "approved": true,
        "createdDtTm": "2022-01-04T12:58:10.8883793+00:00",
        "modifiedDtTm": "2022-04-12T16:33:52.4465923+00:00",
        "treatmentCenterId": "d0f6aa5f-c6e9-4cb9-3762-08d9cf81dc97",
        "latitude": 39.74519,
        "longitude": -104.965627,
        "distance": 1.3423126257436047,
        "websiteUrl": "https://www.rockymountaincancercenters.com/locations/denver-midtown",
        "websiteDisplayText": "Website",
        "centerType": "hospital-based"
    },
    {
        "address1": "1635 Aurora Ct",
        "address2": null,
        "city": "Aurora",
        "state": "CO",
        "zip": "80045",
        "phoneNumber": null,
        "phoneExtension": null,
        "locationName": "University of Colorado Hospital",
        "approved": true,
        "createdDtTm": "2022-05-17T12:56:50.8968327+00:00",
        "modifiedDtTm": "2022-05-17T12:56:51.2128381+00:00",
        "treatmentCenterId": "96205a95-a8be-4a70-8c6b-08da3804331e",
        "latitude": 39.742118,
        "longitude": -104.840177,
        "distance": 6.262360244599661,
        "websiteUrl": "https://www.uchealth.org/locations/uchealth-anschutz-outpatient-pavilion/",
        "websiteDisplayText": "Website",
        "centerType": "hospital-based"
    },
    {
        "address1": "11700 W 2nd Pl, , CO ",
        "address2": null,
        "city": "Lakewood",
        "state": "CO",
        "zip": "80228",
        "phoneNumber": "(720) 321-0000",
        "phoneExtension": null,
        "locationName": "St. Anthony's Outpatient Imaging Center ",
        "approved": true,
        "createdDtTm": "2022-04-29T14:07:45.851047+00:00",
        "modifiedDtTm": "2022-07-08T12:32:08.4617702+00:00",
        "treatmentCenterId": "d3ce5df1-df16-435f-e697-08da29e9a290",
        "latitude": 39.715489,
        "longitude": -105.130116,
        "distance": 9.266337712719215,
        "websiteUrl": "https://www.centura.org/location/st-anthony-hospital?utm_source=yext&utm_medium=organic_google&utm_term=3818557065890446230&utm_content=facilities_lan",
        "websiteDisplayText": "Website",
        "centerType": "hospital-based"
    },
    {
        "address1": "10107 Ridgegate Pkwy",
        "address2": "Suite 200",
        "city": "Lone tree",
        "state": "CO",
        "zip": "80124",
        "phoneNumber": "779-227-4864",
        "phoneExtension": null,
        "locationName": "Rocky Mountain Cancer Center - Lone Tree",
        "approved": true,
        "createdDtTm": "2022-01-31T13:33:12.4932238+00:00",
        "modifiedDtTm": "2022-01-31T13:33:13.2498401+00:00",
        "treatmentCenterId": "9caf4353-1a7f-436e-74da-08d9e4be3a65",
        "latitude": 39.529995,
        "longitude": -104.870321,
        "distance": 14.368695285636331,
        "websiteUrl": "https://www.rockymountaincancercenters.com/locations/lone-tree-skyridge?utm_source=local-listings&utm_medium=google&utm_campaign=Rio-Listings",
        "websiteDisplayText": "Website",
        "centerType": "stand-alone imaging center"
    },
    {
        "address1": "4715 Arapahoe Ave",
        "address2": "100",
        "city": "Boulder",
        "state": "CO",
        "zip": "80303",
        "phoneNumber": "779-227-4864",
        "phoneExtension": null,
        "locationName": "Rocky Mountain Cancer Center - Boulder ",
        "approved": true,
        "createdDtTm": "2022-06-24T13:24:04.4095956+00:00",
        "modifiedDtTm": "2022-06-24T13:24:04.7088771+00:00",
        "treatmentCenterId": "f7091d1a-d324-4691-2ab6-08da55e3b519",
        "latitude": 40.015168,
        "longitude": -105.236897,
        "distance": 24.847112899908065,
        "websiteUrl": "https://www.rockymountaincancercenters.com/locations/boulder",
        "websiteDisplayText": "Website",
        "centerType": "hospital-based"
    },
    {
        "address1": "1915 Wilmington Dr",
        "address2": "Suite 101",
        "city": "Fort Collins",
        "state": "CO",
        "zip": "80528",
        "phoneNumber": "970-204-0202",
        "phoneExtension": null,
        "locationName": "PET Imaging of Northern Colorado",
        "approved": true,
        "createdDtTm": "2022-02-04T12:50:55.9560816+00:00",
        "modifiedDtTm": "2022-02-04T12:50:56.4486923+00:00",
        "treatmentCenterId": "e9ae31f5-0ca9-4153-a0c1-08d9e7dcc747",
        "latitude": 40.519538,
        "longitude": -105.042728,
        "distance": 54.94176062495651,
        "websiteUrl": "https://petimaging.us/",
        "websiteDisplayText": "Website",
        "centerType": "stand-alone imaging center"
    },
    {
        "address1": "3027 N Circle Dr ",
        "address2": "Suite 120",
        "city": " Colorado Springs",
        "state": "CO",
        "zip": "80909",
        "phoneNumber": "(719) 577-2550",
        "phoneExtension": null,
        "locationName": "RMCC Colorado Springs ",
        "approved": true,
        "createdDtTm": "2022-06-02T11:59:23.0409144+00:00",
        "modifiedDtTm": "2022-06-02T11:59:23.4074825+00:00",
        "treatmentCenterId": "6bc09e44-7105-4e3a-029f-08da448efe31",
        "latitude": 38.874399,
        "longitude": -104.793574,
        "distance": 59.55600106057936,
        "websiteUrl": null,
        "websiteDisplayText": null,
        "centerType": "hospital-based"
    },
    {
        "address1": "2312 N. Nevada Ave., ",
        "address2": "Suite 400",
        "city": "Colorado Springs",
        "state": "CO",
        "zip": "80907",
        "phoneNumber": "779-227-4864",
        "phoneExtension": null,
        "locationName": "Rocky Mountain Cancer Centers - Colorado Springs",
        "approved": true,
        "createdDtTm": "2022-06-07T13:10:16.530871+00:00",
        "modifiedDtTm": "2022-06-07T13:10:16.7963621+00:00",
        "treatmentCenterId": "d88cf527-5d1a-4bdb-f0f7-08da4886a17c",
        "latitude": 38.86599,
        "longitude": -104.820543,
        "distance": 59.93909683125607,
        "websiteUrl": "https://www.rockymountaincancercenters.com/locations/colorado-springs-penrose",
        "websiteDisplayText": "Website",
        "centerType": "hospital-based"
    },
    {
        "address1": "1750 E 30th St",
        "address2": null,
        "city": "Farmington",
        "state": "NM",
        "zip": "87401",
        "phoneNumber": null,
        "phoneExtension": null,
        "locationName": "X-Ray Associates at Farmington",
        "approved": true,
        "createdDtTm": "2022-04-19T14:03:37.0242191+00:00",
        "modifiedDtTm": "2022-04-19T14:03:37.3769319+00:00",
        "treatmentCenterId": "d69f7334-3db3-413e-d67d-08da220c9410",
        "latitude": 36.757009,
        "longitude": -108.183866,
        "distance": 269.74942020054584,
        "websiteUrl": "https://xranm.com/locations/mri-scan-farmington/",
        "websiteDisplayText": "Website",
        "centerType": "hospital-based"
    },
    {
        "address1": "490 W Zia Rd",
        "address2": " A110",
        "city": "Santa Fe",
        "state": "NM",
        "zip": "87505",
        "phoneNumber": "505-998-3096",
        "phoneExtension": null,
        "locationName": "X-Ray Associates at Santa Fe",
        "approved": true,
        "createdDtTm": "2022-03-01T17:06:36.5440651+00:00",
        "modifiedDtTm": "2022-03-01T17:06:36.9790317+00:00",
        "treatmentCenterId": "a65e2c60-601c-46d5-a983-08d9fac67231",
        "latitude": 35.646041,
        "longitude": -105.953312,
        "distance": 287.1889132080336,
        "websiteUrl": null,
        "websiteDisplayText": null,
        "centerType": "stand-alone imaging center"
    }
]
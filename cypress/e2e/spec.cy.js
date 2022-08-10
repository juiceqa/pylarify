// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

describe('Example Cypress TodoMVC test', () => {
    ~~

    it('adds 2 todos', function() {
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
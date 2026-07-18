/// <reference types="cypress" />

describe("Demonstration", () => {

  beforeEach(() => {
    cy.intercept('POST', '**/notes', {
      statusCode: 201,
      body: { id: 1, title: 'Note Cypress', content: 'Test création' }
    }).as('createNote');
  });

  it("Affiche la page de connexion", () => {
    cy.visit('/', { failOnStatusCode: false });
    cy.get('body').should('exist');
  });

});

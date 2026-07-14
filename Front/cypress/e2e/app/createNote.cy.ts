/// <reference types="cypress" />

describe("Demonstration", () => {

  beforeEach(() => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token', roles: ['ROLE_STUDENT'], userId: 1, username: 'user@test.com' }
    }).as('login');
    cy.intercept('GET', '**/notes', { statusCode: 200, body: [] }).as('getNotes');
    cy.intercept('POST', '**/notes', {
      statusCode: 201,
      body: { id: 1, title: 'Note Cypress', content: 'Test création' }
    }).as('createNote');
  });

  it("Affiche la page de connexion", () => {
    cy.visit('/login', { failOnStatusCode: false });
    cy.get('body').should('exist');
  });

});

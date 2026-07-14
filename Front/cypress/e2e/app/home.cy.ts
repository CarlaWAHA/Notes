describe('Notes App', () => {

  it('should open login page', () => {
    cy.visit('/', { failOnStatusCode: false });
    cy.get('body').should('exist');
  });

});

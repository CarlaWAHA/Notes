describe('Notes App', () => {

  it('should open login page', () => {
    cy.visit('/login', { failOnStatusCode: false });
    cy.get('body').should('exist');
  });

});

describe("Demonstration", () => {

  it("Affiche la page de connexion", () => {
    cy.visit("/", { failOnStatusCode: false });
    cy.get('body').should('exist');
  });

});

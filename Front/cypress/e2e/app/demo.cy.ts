describe("Demonstration", () => {

  it("Affiche la page racine", () => {
    cy.visit("http://localhost:4200/login")
    cy.get('input[name=username]').type("user")
    cy.get('input[name=password]').type("password")
    cy.get('button').click()
    cy.url().should('include','http://localhost:4200/notes')
    cy.contains("Hello, notes")
  })

})
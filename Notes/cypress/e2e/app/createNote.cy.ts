describe("Demonstration", () => {

  it("Affiche la page racine", () => {
    cy.visit("http://localhost:4200/login")
    cy.get('input[name=username]').type("user")
    cy.get('input[name=password]').type("password")
    cy.get('button').click()
    cy.url().should('include','http://localhost:4200/notes')
    cy.get('input[name=title]').type("Note Cypress")
    cy.get('input[name=content]').type("Test création")
    cy.contains("Ajouter").click()
    cy.intercept("POST", "http://localhost:9000/notes").as("createNote")
})

})
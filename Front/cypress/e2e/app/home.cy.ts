describe("Notes App", () => {

  it("should open the application", () => {
    cy.contains("Hello, notes")
    cy.url().should('include','/login')
  })

})
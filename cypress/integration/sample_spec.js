context('Actions', () => {
  beforeEach(() => {
    cy.visit('https://app-staging.wingzy.com/en')
  })

  it('.passwordForgot() - Redirect to /password/forgot', () => {
    cy.contains("don't have my password").click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/en/password/forgot')
      expect(loc.protocol).to.eq('https:')
    })

    cy.contains('Send the email')
  })

  it('.auth() - Auth by email and password', () => {
    cy.get('form')
      .find('[type="email"]')
      .type('fake@email.com').should('have.value', 'fake@email.com')
  })

})
context('Auth', () => {
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

  it('.passwordReset() - Reset user password', () => {
    cy.visit('https://app-staging.wingzy.com/en/password/reset/9tz7qg9c0yHoaUaiaMCttpFbvgdKy29P8h3ClddHVqnKn38iIET2RwFC6HeWC4ptrxsY3vz5hkorNBZRtyz7lJCH5dRgQIiHQFViwFEmpsUsqhjvuKQdgldRFpQRw50q/2867173bccd0d5392ea9c01087b8b1c8')

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/en/password/reset/9tz7qg9c0yHoaUaiaMCttpFbvgdKy29P8h3ClddHVqnKn38iIET2RwFC6HeWC4ptrxsY3vz5hkorNBZRtyz7lJCH5dRgQIiHQFViwFEmpsUsqhjvuKQdgldRFpQRw50q/2867173bccd0d5392ea9c01087b8b1c8')
      expect(loc.protocol).to.eq('https:')
    })

    cy.get('#form-password-reset')
      .find('[type="password"]')
      .type('c1secret').should('have.value', 'c1secret')

    cy.get('#form-password-reset')
      .find("button")
      .click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/en/fakeorg')
      expect(loc.protocol).to.eq('https:')
    })
  })

  it('.login() - Login by email and password', () => {
    cy.get('#form-login')
      .find('[type="email"]')
      .type('quentin+fake@wingzy.com').should('have.value', 'quentin+fake@wingzy.com')

    cy.get('#form-login')
      .find('[type="password"]')
      .type('c1secret').should('have.value', 'c1secret')

    cy.get('#form-login')
      .contains("Sign In")
      .click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/en/fakeorg')
      expect(loc.protocol).to.eq('https:')
    })

    cy.expect(cy.getCookie('accessToken')).to.exist
    cy.expect(cy.getCookie('refreshToken')).to.exist
  })

  it('.register() - Register by email and password', () => {

    cy.contains('Sign Up').click()
    var randomNumber = Math.floor(Math.random() * (999999 - 100001)) + 100000

    cy.get('#form-register')
      .find('[type="email"]')
      .type('quentin+fake'+randomNumber+'@wingzy.com').should('have.value','quentin+fake'+randomNumber+'@wingzy.com')

    cy.get('#form-register')
      .find('[type="password"]')
      .type('c1secret').should('have.value','c1secret')

    
    cy.get('#form-register').contains('Sign Up').click()

    cy.contains('Thank you for signing up! We just sent you an email to confirm your address, check your inbox...')

  })



})
describe('My First Test', function() {
  it('Does not do much!', function() {
    expect(true).to.equal(true)
  })
})

describe('My First Test', function() {
  it('Does not do much!', function() {
    expect(true).to.equal(false)
  })
})

describe('My First Test', function() {
  it('Visits the staging app', function() {
    cy.visit('https://app-staging.wingzy.com')
    cy.contains('Google').click()
  })
})
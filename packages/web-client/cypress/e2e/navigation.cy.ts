describe('Navigation test', () => {
  const TEST_HOST = Cypress.env('TEST_HOST') || 'https://hotornot.wtf'
  const IC0_HOST = 'https://ic0.app'

  before(() => {
    cy.task(
      'log',
      'Running tests on host: ' + TEST_HOST + ' with ic0 host: ' + IC0_HOST,
    )
  })

  beforeEach(() => {
    cy.visit(TEST_HOST)
  })

  it('On load, should be navigated to home feed', () => {
    cy.url().should('contain', 'feed')
  })

  it('Navigate to user profile from the feed', () => {
    cy.get('div[aria-roledescription=video-info] > a', {
      timeout: 10_000,
    })
      .first()
      .click()

    expect(cy.url().should('contain', 'profile'))
  })

  it("Navigate to user profile and then navigate to user's lovers list", () => {
    cy.get('div[aria-roledescription=video-info] > a', {
      timeout: 10_000,
    })
      .first()
      .click()

    cy.contains('Lovers', { timeout: 20_000 }).click()
    expect(cy.url().should('contain', 'lovers'))
  })

  it('Navigate to user profile and then view a post', () => {
    cy.get('div[aria-roledescription=video-info] > a', {
      timeout: 10_000,
    })
      .first()
      .click()
    cy.scrollTo('bottom')

    cy.get('a[aria-roledescription=user-post]', { timeout: 20_000 })
      .first()
      .click()
      .then(() => {
        expect(cy.url().should('contain', 'post'))
      })
  })
})

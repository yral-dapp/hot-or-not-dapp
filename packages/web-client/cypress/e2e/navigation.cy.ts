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

  it('On a video, navigate to user profile', () => {
    cy.get('div[aria-roledescription=video-info] > a')
      .and('be.visible')
      .click({ force: true })
    cy.wait(1000).then(() => {
      expect(cy.url().should('contain', 'profile'))
    })
  })

  it("Navigate to user profile and then navigate to user's lovers list", () => {
    cy.get('div[aria-roledescription=video-info] > a')
      .and('be.visible')
      .click({ force: true })
    cy.wait(5000).then(() => {
      cy.contains('Lovers').click()
      expect(cy.url().should('contain', 'lovers'))
    })
  })

  it('Navigate to user profile and then view a post', () => {
    cy.get('div[aria-roledescription=video-info] > a')
      .and('be.visible')
      .click({ force: true })
    cy.scrollTo('bottom')
    cy.wait(5000).then(() => {
      cy.get('a[aria-roledescription=user-post]').then(($posts) => {
        $posts[0].click()
        cy.wait(500).then(() => {
          expect(cy.url().should('contain', 'post'))
        })
      })
    })
  })
})

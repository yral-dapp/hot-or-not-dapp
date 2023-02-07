describe('Navigation test', () => {
  const TEST_HOST = Cypress.env('TEST_HOST') || 'https://hotornot.wtf'
  const IC0_HOST = 'https://ic0.app'

  const timeout = 10_000

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
    cy.get('player[i=0] div[aria-roledescription=video-info] > a', {
      timeout,
    }).click({ force: true })
    cy.wait(1000).then(() => {
      expect(cy.url().should('contain', 'profile'))
    })
  })

  it("Navigate to user profile and then navigate to user's lovers list", () => {
    cy.get('player[i=0] div[aria-roledescription=video-info] > a', {
      timeout,
    }).click({ force: true })
    cy.wait(5000).then(() => {
      cy.contains('Lovers')
        .click()
        .then(() => {
          expect(cy.url().should('contain', 'lovers'))
        })
    })
  })

  it('Navigate to user profile and then view a post', () => {
    cy.get('player[i=0] div[aria-roledescription=video-info] > a').click({
      force: true,
    })
    cy.scrollTo('bottom')
    cy.wait(5000).then(() => {
      cy.get('a[aria-roledescription=user-post]').then(($posts) => {
        $posts[0].click()
        expect(cy.url().should('contain', 'post'))
      })
    })
  })
})

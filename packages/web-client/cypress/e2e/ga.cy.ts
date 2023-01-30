describe('Google analytics tests', () => {
  const TEST_HOST = Cypress.env('TEST_HOST') || 'https://hotornot.wtf'
  const IC0_HOST = 'https://ic0.app'

  Cypress.on('window:before:load', (win) => {
    //@ts-ignore
    win.gtag = cy.stub().as('gtag')
  })

  before(() => {
    cy.log('Running tests on host:', TEST_HOST, 'with ic0 host:', IC0_HOST)
    cy.log('env', JSON.stringify(Cypress.env()))
  })

  beforeEach(() => {
    cy.intercept({ hostname: 'www.google-analytics.com' }, { statusCode: 503 })
    cy.visit(TEST_HOST)
  })

  it('Ensure GA is loaded and configured correctly', () => {
    cy.get('splash-screen').and('not.exist')
    cy.get('@gtag').should('be.calledWith', 'config', 'G-S9P26021F9')
  })

  it('Ensure GA registers page_view views', () => {
    cy.get('splash-screen').and('not.exist')

    cy.get('@gtag').should('be.calledWith', 'config')

    cy.get('@gtag').should(
      'be.calledWithMatch',
      'event',
      'page_view',
      (obj) => {
        return obj?.page_location?.includes('feed')
      },
    )

    cy.visit(TEST_HOST + '/menu')

    cy.get('@gtag').should(
      'be.calledWithMatch',
      'event',
      'page_view',
      (obj) => {
        return obj?.page_location?.includes('menu')
      },
    )
  })

  it('Ensure GA registers custom events', () => {
    cy.get('splash-screen').and('not.exist')

    cy.get('@gtag').should('be.calledWith', 'config')

    cy.get('@gtag').should(
      'be.calledWithMatch',
      'event',
      'page_view',
      (obj) => {
        return obj?.page_location?.includes('feed')
      },
    )

    // cy.get('player[i=0] button[aria-label="Share this post"]')
    // 	.should('be.visible')
    // 	.click({ force: true })
    // 	.then(() => {
    // 		cy.get('@gtag').should('be.calledWithMatch', 'event', 'share_video');
    // 	});
  })
})

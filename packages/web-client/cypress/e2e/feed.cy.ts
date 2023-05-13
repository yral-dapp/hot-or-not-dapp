describe('Home Feed Tests', () => {
  const TEST_HOST = Cypress.env('TEST_HOST') || 'https://hotornot.wtf'
  const IC0_HOST = 'https://ic0.app'
  const timeout = 20_000

  before(() => {
    cy.task(
      'log',
      'Running tests on host: ' + TEST_HOST + ' with ic0 host: ' + IC0_HOST,
    )
  })

  beforeEach(() => {
    cy.visit(TEST_HOST + '/feed')
  })

  it('First video on feed has a valid source', () => {
    cy.get('video', { timeout }).first().and('have.prop', 'src')
  })

  it('First video on the feed starts auto-playing', () => {
    cy.get('video', { timeout })
      .first()
      .should('be.visible')
      .and('have.prop', 'paused', false)
      .and('have.prop', 'ended', false)
  })

  it('First video on a feed has a positive duration', () => {
    cy.get('video', { timeout })
      .first()
      .and('have.prop', 'paused', false)
      .then(() => {
        cy.get('video', { timeout })
          .first()
          .should('be.visible')
          .then(($video) => {
            expect(($video[0] as HTMLVideoElement).duration).to.be.gt(0)
          })
      })
  })

  it('Measure first video load and show time on feed', () => {
    const t0 = performance.now()
    cy.get('splash-screen', { timeout }).and('not.exist')
    cy.get('video', { timeout })
      .first()
      .should('be.visible')
      .should('have.prop', 'paused', false)
      .then(() => {
        cy.wrap(performance.now()).then((t1) => {
          cy.log(
            `Video is visible and started playing at ${t1 - t0} milliseconds.`,
          )
        })
      })
  })

  it('Click to unmute video', () => {
    cy.get('splash-screen', { timeout }).and('not.exist')
    const video = cy
      .get('video', { timeout })
      .first()
      .should('be.visible')
      .and('have.prop', 'paused', false)
      .and('have.prop', 'muted', true)
    video.click().then(() => {
      video.should('have.prop', 'muted', false)
    })
  })

  it('Scrolling on main feed', () => {
    cy.task('log', 'Waiting for more videos to load to start scrolling')
    cy.get('splash-screen', { timeout }).and('exist')
    cy.get('splash-screen', { timeout }).and('not.exist')
    cy.get('video', { timeout: 40_000 })
      .first()
      .then(() => {
        const SCROLL_COUNT = 20
        cy.task('log', 'Next videos loaded, now starting to scroll')
        const t0 = performance.now()
        cy.get('video[data-index=0]', { timeout }).should('be.visible').click()

        cy.wrap(Array(SCROLL_COUNT))
          .each((el, index) => {
            cy.log('Checking video with index:', index)

            const video = cy.get(`video[data-index=${index}]`, { timeout })

            video.scrollIntoView().wait(1000)

            video
              .and('have.prop', 'paused', false)
              .and('have.prop', 'muted', false)

            cy.log('✅ Video with index:', index, 'is paused and muted!')

            cy.get(`video[data-index=${index + 1}]`, { timeout }).and(
              'have.prop',
              'paused',
              true,
            )

            cy.log('✅ Next video:', index + 1, 'is paused!')

            if (index !== 0) {
              cy.get(`video[data-index=${index - 1}]`, { timeout }).and(
                'have.prop',
                'paused',
                true,
              )

              cy.log('✅ Previous video:', index - 1, 'is paused!')
            }
            if (index === 9) {
              cy.wrap(performance.now()).then((t1) => {
                cy.task(
                  'log',
                  `Scrolling from 0 to 10 times completed in: ${
                    t1 - t0
                  } milliseconds.`,
                )
              })
            }
          })
          .then(() => {
            cy.wrap(performance.now()).then((t1) => {
              cy.task(
                'log',
                `Scrolling from 0 to 20 times completed in: ${
                  t1 - t0
                } milliseconds.`,
              )
            })
          })
      })
  })
})

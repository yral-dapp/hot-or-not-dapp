describe('Home Feed Tests', () => {
	const TEST_HOST = Cypress.env('TEST_HOST') || 'http://localhost:5173';
	const IC0_HOST = 'https://ic0.app';

	Cypress.on('window:before:load', (win) => {
		// because this is called before any scripts
		// have loaded - the ga function is undefined
		// so we need to create it.
		win.gtag = cy.stub().as('gtag');
	});

	before(() => {
		cy.log('Running tests on host:', TEST_HOST, 'with ic0 host:', IC0_HOST);
		cy.log('env', JSON.stringify(Cypress.env()));
	});

	beforeEach(() => {
		cy.intercept({ hostname: 'www.google-analytics.com' }, { statusCode: 503 });
		cy.visit(TEST_HOST);
	});

	it('can ensure window.ga is called correctly', () => {
		Cypress.on('window:before:load', (win) => {
			// because this is called before any scripts
			// have loaded - the ga function is undefined
			// so we need to create it.
			(win as any).gtag = cy.stub().as('gtag');
		});
		cy.get('@gtag', { timeout: 5000 })
			// ensure GA was created with our google analytics ID
			.should('be.called');
		// and ensure that the initial pageview was sent

		// now click the anchor tag which causes a hashchange event
		// cy.find('a')
		// 	.and('have.attr', 'href', TEST_HOST + '/menu')
		// 	.click();

		// cy.url().contains('menu');

		// // make sure GA was sent this pageview
		// cy.get('@gtag').should('be.calledWith', 'send', 'pageview', 'menu');

		// and now do it again for page3
	});
});

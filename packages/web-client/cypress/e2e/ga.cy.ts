describe('Home Feed Tests', () => {
	const TEST_HOST = Cypress.env('TEST_HOST') || 'http://localhost:5173';
	const IC0_HOST = 'https://ic0.app';

	Cypress.on('window:before:load', (win) => {
		//@ts-ignore
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
		cy.get('@gtag', { timeout: 5000 }).should('be.called');

		cy.get('@gtag').should('be.calledWith', 'event', 'page_view', 'contain', 'feed');

		// now click the anchor tag which causes a pageview event
		cy.get('a[aria-label="Navigate to menu for more options"]')
			.and('have.attr', 'href', '/menu')
			.click();

		cy.url()
			.should('contain', 'menu')
			.then(() => {
				cy.get('@gtag').should('be.calledWith', 'event', 'page_view', TEST_HOST + '/menu');
			});
	});
});

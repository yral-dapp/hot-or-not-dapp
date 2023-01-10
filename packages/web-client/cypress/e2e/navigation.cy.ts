describe('Navigation test', () => {
	const TEST_HOST = Cypress.env('TEST_HOST') || 'https://hotornot.wtf';
	const IC0_HOST = 'https://ic0.app';

	before(() => {
		cy.task('log', 'Running tests on host: ' + TEST_HOST + ' with ic0 host: ' + IC0_HOST);
	});

	beforeEach(() => {
		cy.visit(TEST_HOST);
	});

	it('On load, should be navigated to home feed', () => {
		cy.url().should('contain', 'feed');
	});

	it('On a video, navigate to user profile', () => {
		cy.get('splash-screen').and('not.exist');
		cy.get('a[aria-roledescription=video-info]').click();
		expect(cy.url().should('contain', 'profile'));
	});

	it("Navigate to user profile and then navigate to user's lovers list", () => {
		cy.get('splash-screen').and('not.exist');
		cy.get('a[aria-roledescription=video-info]').click();
		cy.find('a').contains('Lovers').click();
		expect(cy.url().should('contain', 'lovers'));
	});

	it('Navigate to user profile and then view a post', () => {
		cy.get('splash-screen').and('not.exist');
		cy.get('a[aria-roledescription=video-info]').click();
		cy.scrollTo('bottom');
		cy.wait(2000).then(() => {
			cy.find('a[aria-roledescription=user-post]').click();
			expect(cy.url().should('contain', 'post'));
		});
	});
});

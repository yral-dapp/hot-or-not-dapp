describe('visit home feed', () => {
	beforeEach(() => {
		cy.visit('https://hotornot.wtf');
	});

	it('video has source', () => {
		cy.get('video').should('have.prop', 'src');
	});

	it('video is auto-playing', () => {
		cy.get('video').should('have.prop', 'paused', false).and('have.prop', 'ended', false);
	});

	it('it has duration', () => {
		cy.get('video').should(($video) => {
			expect($video[0].duration).to.be.gt(0);
		});
	});

	it('measure load time', () => {
		const t0 = performance.now();

		cy.get('splash-screen').should('be.visible');
		cy.get('splash-screen').should('not.exist');
		cy.get('video')
			.should('have.prop', 'paused', false)
			.then(() => {
				cy.wrap(performance.now()).then((t1) => {
					cy.log(`Video is visible and started playing at ${t1 - t0} milliseconds.`);
				});
			});
	});

	it('click to unmute', () => {
		const player0 = cy.get('player').and('have.attr', 'i', 0);
		player0.get('video').should('have.prop', 'paused', false);
		player0.get('video').should('have.prop', 'muted', true);
		player0.get('video').click();
		player0.get('video').should('have.prop', 'muted', false);
	});

	// it('click to unmute', () => {
	// 	Cypress.config('defaultCommandTimeout', 10000);
	// 	const player1 = cy.get('player').and('have.attr', 'i', 1);
	// 	cy.get('splash-screen')
	// 		.should('not.exist')
	// 		.then(() => {
	// 			player1.scrollIntoView();
	// 		});
	// });
});

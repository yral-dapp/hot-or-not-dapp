describe('visit home feed', () => {
	beforeEach(() => {
		cy.visit('https://hotornot.wtf');
	});

	it('video has source', () => {
		cy.get('video').should('have.prop', 'src');
	});

	it('video is autoplaying', () => {
		cy.get('video').should('have.prop', 'paused', false).and('have.prop', 'ended', false);
	});

	it('video is not playing', () => {
		cy.get('video')
			.should('have.prop', 'paused', true)
			.then(($video) => {
				$video[0].play();
			});

		cy.get('video').should('have.prop', 'paused', false).and('have.prop', 'ended', false);
	});

	it('it has duration', () => {
		cy.get('video').should(($video) => {
			expect($video[0].duration).to.be.gt(0);
		});
	});
});

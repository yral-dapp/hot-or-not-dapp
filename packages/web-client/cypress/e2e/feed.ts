const TEST_HOST = process.env.TEST_HOST || 'https://hotornot.wtf';
const IC0_HOST = process.env.IC0_HOST || 'https://ic0.app';

describe('Home Feed Tests', () => {
	before(() => {
		cy.log('Running tests on host:', TEST_HOST, 'with ic0 host:', IC0_HOST);
	});

	beforeEach(() => {
		cy.visit(TEST_HOST);
	});

	it('First video on feed has a valid source', () => {
		cy.get('player[i=0] > video').should('have.prop', 'src');
	});

	it('First video on the feed starts auto-playing', () => {
		cy.get('player[i=0] > video')
			.should('have.prop', 'paused', false)
			.and('have.prop', 'ended', false);
	});

	it('First video on a feed has a positive duration', () => {
		cy.wait(5000).then(() => {
			const vid = cy.get('player[i=0] > video');
			vid.then(($video) => {
				expect(($video[0] as HTMLVideoElement).duration).to.be.gt(0);
			});
		});
	});

	it('Measure first video load and show time on feed', () => {
		const t0 = performance.now();

		cy.get('splash-screen').should('be.visible');
		cy.get('splash-screen').should('not.exist');
		cy.get('player[i=0] > video')
			.should('have.prop', 'paused', false)
			.then(() => {
				cy.wrap(performance.now()).then((t1) => {
					cy.log(`Video is visible and started playing at ${t1 - t0} milliseconds.`);
				});
			});
	});

	it('Click to unmute video', () => {
		const video = cy.get('player[i=0] > video');
		video.should('have.prop', 'paused', false);
		video.should('have.prop', 'muted', true);
		video.click();
		video.should('have.prop', 'muted', false);
	});

	it('Scrolling on main feed', () => {
		cy.intercept({
			method: 'POST',
			url: IC0_HOST + '/api/v2/**'
		}).as('ic0ApiReq');
		cy.wait('@ic0ApiReq', { timeout: 40000 }).then(() => {
			cy.wait(20000).then(() => {
				const vid0 = cy.get('player[i=0] > video');
				vid0.then(($video) => {
					$video[0].click();
				});

				const SCROLL_COUNT = 10;
				cy.wrap(Array(SCROLL_COUNT)).each((_, index) => {
					cy.wait(1000).then(() => {
						cy.get(`player[i=${index}] > video`)
							.and('have.prop', 'paused', false)
							.and('have.prop', 'muted', false);
						const nextVideo = cy.get(`player[i=${index + 1}] > video`);
						nextVideo.and('have.prop', 'paused', true);
						if (index !== 0) {
							cy.get(`player[i=${index - 1}] > video`).and('have.prop', 'paused', true);
						}
						nextVideo.scrollIntoView();
					});
				});
			});
		});
	});
});

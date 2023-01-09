const TEST_HOST = Cypress.env('TEST_HOST') || 'https://hotornot.wtf';
const IC0_HOST = 'https://ic0.app';

describe('Home Feed Tests', () => {
	before(() => {
		cy.task('log', 'Running tests on host: ' + TEST_HOST + ' with ic0 host: ' + IC0_HOST);
	});

	beforeEach(() => {
		cy.visit(TEST_HOST);
	});

	it('First video on feed has a valid source', () => {
		cy.get('player[i=0] > video').and('have.prop', 'src');
	});

	it('First video on the feed starts auto-playing', () => {
		cy.get('player[i=0] > video')
			.and('have.prop', 'paused', false)
			.and('have.prop', 'ended', false);
	});

	it('First video on a feed has a positive duration', () => {
		cy.get('player[i=0] > video')
			.and('have.prop', 'paused', false)
			.then(($video) => {
				expect(($video[0] as HTMLVideoElement).duration).to.be.gt(0);
			});
	});

	it('Measure first video load and show time on feed', () => {
		const t0 = performance.now();
		cy.get('splash-screen').and('not.exist');
		cy.get('player[i=0] > video')
			.should('have.prop', 'paused', false)
			.then(() => {
				cy.wrap(performance.now()).then((t1) => {
					cy.log(`Video is visible and started playing at ${t1 - t0} milliseconds.`);
				});
			});
	});

	it('Click to unmute video', () => {
		const video = cy
			.get('player[i=0] > video')
			.and('have.prop', 'paused', false)
			.and('have.prop', 'muted', true);
		video.click().then(() => {
			video.should('have.prop', 'muted', false);
		});
	});

	it('Scrolling on main feed', () => {
		cy.task('log', 'Waiting for more videos to load to start scrolling');
		cy.get('player[i=1] > video', { timeout: 40000 }).then(() => {
			const SCROLL_COUNT = 10;
			cy.task('log', 'Next videos loaded, now starting to scroll');
			const t0 = performance.now();
			cy.get('player[i=0] > video').then(($video) => {
				$video[0].click();
			});

			cy.wrap(Array(SCROLL_COUNT))
				.each((_, index) => {
					cy.get(`player[i=${index}] > video`)
						.and('have.prop', 'paused', false)
						.and('have.prop', 'muted', false);
					const nextVideo = cy.get(`player[i=${index + 1}] > video`);
					nextVideo.and('have.prop', 'paused', true);
					if (index !== 0) {
						cy.get(`player[i=${index - 1}] > video`).and('have.prop', 'paused', true);
					}
					nextVideo.scrollIntoView();
				})
				.then(() => {
					cy.wrap(performance.now()).then((t1) => {
						cy.task(
							'log',
							`Scrolling ${SCROLL_COUNT} times completed in: ${t1 - t0} milliseconds.`
						);
					});
				});
		});
	});
});

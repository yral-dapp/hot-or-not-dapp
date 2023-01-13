const host = process.env.lhci_host;

module.exports = {
	ci: {
		collect: {
			numberOfRuns: 1,
			url: [`${host}`, `${host}/menu`]
		},

		upload: {
			target: 'filesystem',
			outputDir: './lhci_report'
		}
	}
};

module.exports = {
	ci: {
		collect: {
			url: [
				'http://localhost:4173',
				'http://localhost:4173/menu',
				'http://localhost:4173/profile/iancu'
			],
			startServerCommand: 'npm run web-client:preview:static'
		},
		upload: {
			target: 'filesystem',
			outputDir: './lhci_report'
		}
	}
};

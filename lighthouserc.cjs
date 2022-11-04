module.exports = {
	ci: {
		collect: {
			url: [
				'https://harsh-fix-fix-performance-ac.hot-or-not-dapp.pages.dev',
				'https://harsh-fix-fix-performance-ac.hot-or-not-dapp.pages.dev/menu',
				'https://harsh-fix-fix-performance-ac.hot-or-not-dapp.pages.dev/profile/iancu'
			],
			startServerCommand: 'npm run web-client:preview'
		},
		upload: {
			target: 'filesystem',
			outputDir: './lhci_report'
		}
	}
};

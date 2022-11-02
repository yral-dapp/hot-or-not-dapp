module.exports = {
	ci: {
		collect: {
			url: ['http://localhost:4173'],
			startServerCommand: 'npm run web-client:preview:static'
		},
		upload: {
			target: 'hotornot-lhci-report'
		}
	}
};

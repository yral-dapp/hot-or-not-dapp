module.exports = {
	ci: {
		collect: {
			url: ['http://localhost:4173'],
			startServerCommand: 'npm run web-client:preview:static'
		},
		upload: {
			target: 'temporary-public-storage'
		}
	}
};

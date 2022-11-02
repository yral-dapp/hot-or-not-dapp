module.exports = {
	ci: {
		collect: {
			url: ['http://localhost:3000/'],
			startServerCommand: 'npm run web-client:preview:static'
		},
		upload: {
			target: 'hotornot-lhci-report'
		}
	}
};

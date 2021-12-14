module.exports = {
	ci: {
		collect: {
			numberOfRuns: 3,
			url: ['https://localhost:2222'],
			settings: {
				chromeFlags: '--ignore-certificate-errors',
			},
		},
		upload: {
			target: 'filesystem',
			outputDir: 'lighthouse',
		},
	},
};

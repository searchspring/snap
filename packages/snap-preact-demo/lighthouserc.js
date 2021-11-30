module.exports = {
	ci: {
		collect: {
			numberOfRuns: 3,
			url: ['https://localhost:4444'],
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

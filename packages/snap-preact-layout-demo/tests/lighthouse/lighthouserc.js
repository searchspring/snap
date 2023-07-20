/*
	lhci
	configuration for lighthouse testing
	https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 */

module.exports = {
	ci: {
		collect: {
			numberOfRuns: 3,
			staticDistDir: './tests/lighthouse/public', // for localhost
			url: ['http://localhost/lighthouse.html'],
		},
		upload: {
			target: 'filesystem',
			outputDir: './tests/lighthouse/runs',
		},
	},
};

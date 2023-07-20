const { defineConfig } = require('cypress');

module.exports = defineConfig({
	defaultCommandTimeout: 12000,
	viewportWidth: 1280,
	viewportHeight: 960,
	chromeWebSecurity: false,
	video: false,
	screenshotOnRunFailure: false,
	e2e: {
		testIsolation: false,
		setupNodeEvents(on, config) {
			return require('./cypress/plugins/index.js')(on, config);
		},
	},
});

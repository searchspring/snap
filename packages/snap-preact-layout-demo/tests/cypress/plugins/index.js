// ***********************************************************
// Custom Snap Cypress Plugins
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { renameSync } = require('fs');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
	// `on` is used to hook into various events Cypress emits
	// `config` is the resolved Cypress config

	on('before:browser:launch', (browser, launchOptions) => {
		if (browser.name === 'electron' && browser.isHeadless) {
			launchOptions.preferences.width = 1280;
			launchOptions.preferences.height = 960;
		}

		return launchOptions;
	});

	on('after:screenshot', ({ path }) => {
		// this screenshot is used in snapp-explorer
		if (path.includes('snapshot')) {
			renameSync(path, '../public/snapshot.png');
		}
	});

	/*
		used for logging in headless console

		utilize in test via:
		cy.task('log', 'log to the console');
	 */
	on('task', {
		log(...message) {
			console.log(...message);

			return null;
		},
	});

	return config;
};

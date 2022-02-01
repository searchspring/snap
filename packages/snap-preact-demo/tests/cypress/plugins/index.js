/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
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
		add task to log to headless console

		use in test with:
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

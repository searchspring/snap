// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import packageJSON from '../../../package.json';

Cypress.Commands.add('addScript', (script) => {
	cy.document().then((doc) => {
		const scriptElem = document.createElement('script');
		scriptElem.type = 'text/javascript';
		scriptElem.src = script;
		doc.head.appendChild(scriptElem);
	});
});

Cypress.Commands.add('addScripts', (scripts = []) => {
	scripts = typeof scripts === 'string' ? [scripts] : scripts;

	if (!scripts.length) return;

	scripts.forEach((script) => {
		cy.addScript(script);
	});
});

Cypress.Commands.add('addLocalSnap', () => {
	cy.window().then((window) => {
		if (!window?.searchspring) {
			cy.addScript('https://localhost:3333/bundle.js');
		}
	});
});

Cypress.Commands.add('addCloudSnap', (branch = 'production') => {
	cy.intercept(/.*snapui.searchspring.io\/.*\/bundle.js$/).as('script');
	cy.addScript(`https://snapui.searchspring.io/${packageJSON.searchspring.siteId}/${branch}/bundle.js`);
});

Cypress.Commands.add('snapController', (controllerId = 'search') => {
	return cy.window().then((window) => {
		return new Cypress.Promise((resolve, reject) => {
			const checkTimeout = 200;
			let interval = setInterval(() => {
				const cntrlr = window?.searchspring?.controller[controllerId];

				if (cntrlr) {
					clearInterval(interval);

					const after = function afterLoad({ controller }) {
						controller.eventManager.events.afterStore.remove(afterLoad);
						resolve(cntrlr);
					};

					if (cntrlr.store.loading) {
						cntrlr.on('afterStore', after);
					} else {
						resolve(cntrlr);
					}
				}
			}, checkTimeout);
		});
	});
});

Cypress.Commands.add('waitForBundle', () => {
	return cy.window().then((window) => {
		return new Cypress.Promise((resolve) => {
			const checkTimeout = 100;
			let interval = setInterval(() => {
				if (window.searchspring) {
					clearInterval(interval);
					resolve(window.searchspring);
				}
			}, checkTimeout);
		});
	});
});

Cypress.Commands.add('waitForIdle', (options) => {
	options = { timeout: 200, ...options };

	return cy.window().then((window) => {
		return new Cypress.Promise((resolve) => {
			let timeout = setTimeout(resolve, options.timeout);

			const observer = new window.PerformanceObserver(() => {
				clearTimeout(timeout);
				timeout = setTimeout(resolve, options.timeout);
			});

			observer.observe({ entryTypes: ['resource'] });
		});
	});
});

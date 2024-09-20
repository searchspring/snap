// ***********************************************
// Custom Snap Cypress Commands
//
// For more comprehensive examples:
// https://on.cypress.io/custom-commands
// ***********************************************

import packageJSON from '../../../package.json';
import 'cypress-wait-until';

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

Cypress.Commands.add('snapController', (controllerId = 'search', options) => {
	const defaultOptions = {
		delay: 200,
	};

	const mergedOptions = { ...defaultOptions, ...options };
	cy.wait(mergedOptions.delay);

	return cy.window().then((window) => {
		return new Cypress.Promise((resolve) => {
			const checkTimeout = 200;
			const interval = setInterval(() => {
				if (window.searchspring?.controller && window.searchspring.controller[controllerId]) {
					if (!window.searchspring.controller[controllerId].store.loading) {
						clearInterval(interval);
						resolve(window.searchspring.controller[controllerId]);
					}
				}
			}, checkTimeout);
		});
	});
});

Cypress.Commands.add('snapController', (controllerId = 'search', options) => {
	const defaultOptions = {
		delay: 300,
	};

	const mergedOptions = { ...defaultOptions, ...options };
	return cy.wait(mergedOptions.delay).then(() => {
		return cy.window().then((window) => {
			return new Cypress.Promise((resolve) => {
				const checkTimeout = 150;
				const interval = setInterval(() => {
					if (window.searchspring?.controller && window.searchspring.controller[controllerId]) {
						if (!window.searchspring.controller[controllerId].store.loading) {
							clearInterval(interval);
							resolve(window.searchspring.controller[controllerId]);
						}
					}
				}, checkTimeout);
			});
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

Cypress.Commands.add('waitForRecsReady', () => {
	return cy.document().then((doc) => {
		return new Cypress.Promise((resolve) => {
			setTimeout(resolve, 5000);
			doc.addEventListener('RecsReady', resolve);
		});
	});
});

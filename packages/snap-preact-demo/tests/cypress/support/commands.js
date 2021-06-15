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

Cypress.Commands.add('snapStore', (controller = 'search') => {
	cy.window().then((window) => {
		return new Cypress.Promise((resolve, reject) => {
			const cntrlr = getByPath(window.searchspring.controller, controller);

			const after = function afterLoad({ controller }) {
				controller.eventManager.events.afterStore.remove(afterLoad);
				resolve(cntrlr.store);
			};

			if (cntrlr.store.loading) {
				cntrlr.on('afterStore', after);
			} else {
				resolve(cntrlr.store);
			}
		});
	});
});

function getByPath(obj, path) {
	path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
	path = path.replace(/^\./, ''); // strip a leading dot

	const split = path.split('.');
	for (let i = 0, n = split.length; i < n; ++i) {
		const p = split[i];
		if (p in obj) {
			obj = obj[p];
		} else {
			return;
		}
	}

	return obj;
}

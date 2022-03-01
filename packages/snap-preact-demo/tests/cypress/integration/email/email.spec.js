/**
 * End to end tests with Cypress!
 *
 * The purpose of these tests is to prevent publishing of the bundle if a
 * breaking change has been made to the implementation code in the future
 *
 * Start by fill out the config object below. If a selector is not provided,
 * the applicable tests will be skipped.
 *
 */

const config = {
	url: 'https://localhost:2222/email.html',
	disableGA: '', // disable google analytic events (example: 'UA-123456-1')
	selectors: {
		email: {
			result: '.ss-emailrec',
		},
	},
};

describe('Email Recs', () => {
	describe('Setup', () => {
		it('has valid config', () => {
			cy.wrap(config).its('url').should('have.length.at.least', 1);
			cy.wrap(config).its('selectors.email.result').should('have.length.at.least', 1);
			cy.visit(config.url);
		});

		it('snap bundle exists on email page', () => {
			cy.visit(config.url);

			cy.waitForBundle().then((searchspring) => {
				expect(searchspring).to.exist;
			});
		});
	});

	describe('Tests Email Recs', () => {
		it('has a controller with an products in store immediately', function () {
			cy.snapController('recommend_email-test20').then(({ store }) => {
				expect(store.results.length).to.equal(20);
				expect(window.RecsReady).to.equal(undefined);
			});
		});

		it('displays products on the page', function () {
			cy.get(`${config?.selectors?.email.result}`).should('have.length', 20);
		});

		it('runs the recsReady event', function () {
			return cy.window().then((window) => {
				expect(window.RecsReady).to.equal(true);
			});
		});

		it('has 20 images in the dom', function () {
			return cy.document().then((doc) => {
				expect(doc.images.length).to.equal(20);
			});
		});
	});
});

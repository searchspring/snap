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
	url: 'https://localhost:2222', // page containing autocomplete (recommended: home/about/contact page)
	disableGA: '', // disable google analytic events (example: 'UA-123456-1')
	selectors: {
		website: {
			openInputButton: '', // selector for a button to click in order to make the input visible
			input: '.searchspring-ac', // selector of <input> elements (config.controllers[].autocomplete[].config.selector)
		},
		autocomplete: {
			main: '.ss__autocomplete',
			// selector of the wrapping element. Expects child element to contain <a>
			term: `.ss__autocomplete .ss__autocomplete__terms__option`,
			facet: '.ss__autocomplete .ss__facet .ss__facet__options',
			result: '.ss__autocomplete .ss__results .ss__result',
			seeMore: '.ss__autocomplete .ss__autocomplete__content__info',
		},
	},
	startingQuery: 't', // initial query (displays terms, facets, and results)
};

describe('Autocomplete', () => {
	describe('Setup', () => {
		it('has valid config', () => {
			cy.wrap(config).its('url').should('have.length.at.least', 1);
			cy.wrap(config).its('startingQuery').should('have.length.at.least', 1);
			cy.wrap(config).its('selectors.website.input').should('have.length.at.least', 1);
			cy.visit(config.url);
		});

		it('snap bundle exists on autocomplete page', () => {
			cy.visit(config.url);

			cy.waitForBundle().then((searchspring) => {
				expect(searchspring).to.exist;
			});
		});
	});

	describe('Tests Autocomplete', () => {
		it('has a controller with an empty store', function () {
			cy.snapController('autocomplete').then(({ store }) => {
				expect(store.results.length).to.equal(0);
				expect(store.terms.length).to.equal(0);
				expect(store.state.input).to.equal(undefined);
			});
		});

		it('renders trending terms when input focused', function () {
			cy.window().then((window) => {
				if (!window?.searchspring?.controller?.autocomplete?.config?.settings?.trending) {
					this.skip();
				}

				cy.get(config?.selectors?.website?.input).focus({ force: true });
				cy.snapController('autocomplete').then(({ store }) => {
					cy.get(config?.selectors?.autocomplete.main).should('exist');
				});
			});
		});

		it('has trending terms', function () {
			cy.snapController('autocomplete').then((controller) => {
				if (!controller?.config?.settings?.trending) {
					this.skip();
				}

				cy.get(config?.selectors?.website?.input).focus({ force: true });

				cy.get(config?.selectors?.autocomplete.term).should('have.length', controller.store.trending.length);
			});
		});

		it('auto selects first trending term', function () {
			cy.snapController('autocomplete').then((controller) => {
				if (!controller?.config?.settings?.trending.showResults) {
					this.skip();
				}

				cy.get(config?.selectors?.website?.input).focus({ force: true });

				cy.get(config?.selectors?.autocomplete.term).should('have.length', controller.store.trending.length);
				cy.get(`${config?.selectors?.autocomplete.term}:first`).should('have.class', 'ss__autocomplete__terms__option--active');
				expect(controller.store.trending[0].active).to.equal(true);
				cy.get(config?.selectors?.autocomplete.result).should('exist');
			});
		});

		it('can focus a trending term', function () {
			cy.snapController('autocomplete').then((controller) => {
				if (!controller?.config?.settings?.trending) {
					this.skip();
				}

				cy.get(config?.selectors?.website?.input).focus({ force: true });

				cy.get(`${config?.selectors?.autocomplete.term}:last a`).rightclick({ force: true }); // trigger onFocus event

				cy.wait('@autocomplete').should('exist');

				cy.get(config?.selectors?.autocomplete.term).should('have.length', controller.store.trending.length);
				cy.get(config?.selectors?.autocomplete.facet).should('have.length.lte', controller.store.facets.length);
				cy.get(config?.selectors?.autocomplete.result).should('have.length.lte', controller.store.results.length);
			});
		});

		it('can make single letter query', function () {
			if (!config.startingQuery || !config?.selectors?.website?.input) this.skip();

			if (config.selectors.website.openInputButton) {
				cy.get(config.selectors.website.openInputButton).first().click({ force: true });
			}

			cy.get(config.selectors.website.input).first().should('exist').focus().type(config.startingQuery, { force: true });

			cy.wait('@autocomplete').should('exist');

			cy.snapController('autocomplete').then(({ store }) => {
				expect(store.state.input).to.equal(config.startingQuery);
				expect(store.terms.length).to.greaterThan(0);
			});
		});

		it('has correct count and term in see more link', () => {
			if (!config?.selectors?.autocomplete?.seeMore) this.skip();

			cy.snapController('autocomplete').then(({ store }) => {
				const term = store.terms[0].value;

				cy.get(`${config.selectors.autocomplete.seeMore} a[href$="${store.services.urlManager.href}"]`)
					.should('exist')
					.contains(store.pagination.totalResults)
					.contains(term);
			});
		});

		it('can hover over term', function () {
			if (!config?.selectors?.autocomplete?.term) this.skip();

			cy.snapController('autocomplete').then(({ store }) => {
				if (!store.terms.length > 1) this.skip();
				cy.get('body').then((body) => {
					if (!body.find(`${config.selectors.autocomplete.term}`).length) {
						this.skip(); // skip if no terms in DOM
					}
				});

				cy.get(`${config.selectors.autocomplete.term}`).last().find('a').should('exist').rightclick({ force: true }); // trigger onFocus event

				cy.wait('@autocomplete').should('exist');

				cy.snapController('autocomplete').then(({ store }) => {
					const lastTerm = store.terms[store.terms.length - 1];
					expect(lastTerm.active).to.equal(true);
					expect(lastTerm.value).to.equal(store.search.query.string);
				});
			});
		});

		it('can hover over facet', function () {
			if (!config?.selectors?.input && !config?.selectors?.autocomplete?.facet) this.skip();

			cy.get(config.selectors.website.input).first().should('exist').clear({ force: true }).type(config.startingQuery, { force: true });
			cy.wait('@autocomplete').should('exist');

			cy.snapController('autocomplete').then(({ store }) => {
				if (!store.facets.length > 0) this.skip(); //skip if this term has no facets
				cy.get('body').then((body) => {
					if (!body.find(`${config.selectors.autocomplete.facet} a`).length) {
						this.skip(); // skip if no facets in DOM
					}
				});

				cy.get(`${config.selectors.autocomplete.facet} a`).then((facetOptions) => {
					const firstOption = facetOptions[0];
					const optionURL = firstOption.href;

					cy.get(firstOption).rightclick({ force: true }); // trigger onFocus event

					cy.wait('@autocomplete').should('exist');

					cy.snapController('autocomplete').then(({ store }) => {
						cy.wrap(store.services.urlManager).its('state.filter').should('exist');
						cy.wrap(store.services.urlManager.href).should('contain', optionURL);
					});
				});
			});
		});

		it('has results', function () {
			if (!config?.selectors?.autocomplete?.result) this.skip();

			cy.snapController('autocomplete').then(({ store }) => {
				if (!store.results.length) this.skip(); //skip if this term has no results
				cy.get(`${config.selectors.autocomplete.result} a:first`)
					.should('have.length.greaterThan', 0)
					.each((result, index) => {
						cy.get(result).should('have.attr', 'href', store.results[index].mappings.core.url);
					});
			});
		});

		it('has see more link with correct URL', function () {
			if (!config?.selectors?.autocomplete?.seeMore) this.skip();

			cy.snapController('autocomplete').then(({ store }) => {
				cy.get(`${config.selectors.autocomplete.seeMore} a[href$="${store.services.urlManager.href}"]`).should('exist');
			});
		});

		it('can clear input', function () {
			if (!config?.selectors?.website?.input && !config?.startingQuery) this.skip();

			cy.get(config.selectors.website.input)
				.first()
				.should('exist')
				.should('have.value', config.startingQuery)
				.clear({ force: true })
				.should('have.value', '');
		});
	});
});

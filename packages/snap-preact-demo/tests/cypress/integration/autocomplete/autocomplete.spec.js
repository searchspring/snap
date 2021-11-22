describe('Autocomplete', () => {
	beforeEach(() => {
		cy.visit('https://localhost:4444/');
	});
	it('does not render if input not focused', () => {
		cy.get('.ss__autocomplete').should('not.exist');
	});
	it('renders trending terms when input focused', function () {
		cy.window().then((window) => {
			if (!window?.searchspring?.controller?.autocomplete?.config?.settings?.trending) {
				this.skip();
			}
			cy.get('.searchspring-ac').focus();
			cy.snapStore('autocomplete').then((store) => {
				cy.wait(1000);
				cy.get('.ss__autocomplete').should('exist');
			});
		});
	});
	it('has trending terms', function () {
		cy.window().then((window) => {
			if (!window?.searchspring?.controller?.autocomplete?.config?.settings?.trending) {
				this.skip();
			}
			cy.get('.searchspring-ac').focus();
			const trendingTerms = window.searchspring.controller.autocomplete.store.trending;
			cy.get('.ss__autocomplete__terms__option').should('have.length', trendingTerms.length);
		});
	});
	it('can focus a trending term', function () {
		cy.window().then((window) => {
			if (!window?.searchspring?.controller?.autocomplete?.config?.settings?.trending) {
				this.skip();
			}
			cy.get('.searchspring-ac').focus();

			cy.get('.ss__autocomplete__terms__option:first a').should('exist').trigger('focus');
			cy.snapStore('autocomplete').then((store) => {
				cy.get('.ss__autocomplete__terms__option').should('have.length', store.trending.length);
				cy.get('.ss__autocomplete__facets .ss__facet').should('have.length.lte', store.facets.length);
				cy.get('.ss__autocomplete__content .ss__result ').should('have.length.lte', store.results.length);
			});
		});
	});
	it('can focus a facet value', function () {
		cy.window().then((window) => {
			if (!window?.searchspring?.controller?.autocomplete?.config?.settings?.trending) {
				this.skip();
			}
			cy.get('.searchspring-ac').focus();

			cy.get('.ss__autocomplete__terms__option:first a').should('exist').trigger('focus');
			cy.snapStore('autocomplete').then((store) => {
				cy.get('.ss__autocomplete__facets .ss__facet a').first().should('exist').trigger('focus');
				cy.snapStore('autocomplete').then((store) => {
					const facet = store.facets.filter((facet) => facet.filtered);
					expect(facet.length).to.equal(1);
				});
			});
		});
	});
	it('has terms, facets, content when query is performed', function () {
		cy.get('.searchspring-ac').focus().type('r');

		// have to wait for search to start
		cy.wait(500);

		cy.snapStore('autocomplete').then((store) => {
			cy.get('.ss__autocomplete__terms__option').should('have.length', store.terms.length);
			cy.get('.ss__autocomplete__facets .ss__facet').should('have.length.lte', store.facets.length);
			cy.get('.ss__autocomplete__content .ss__result ').should('have.length.lte', store.results.length);
		});
	});
});

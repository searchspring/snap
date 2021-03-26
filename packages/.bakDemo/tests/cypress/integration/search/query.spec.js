describe('Query', () => {
	it('runs the query', () => {
		cy.visit('http://localhost:3333/?q=red');

		// not a good test - but an example
		cy.get('.ss-results-count-total').should('contain.text', 261);

		// has some facets
		cy.get('.ss-facets .ss-facet-container').should('have.lengthOf.at.least', 1);
	});
});

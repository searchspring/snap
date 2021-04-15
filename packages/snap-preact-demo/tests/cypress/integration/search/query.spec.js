describe('Query', () => {
	it('runs the query', () => {
		cy.visit('http://localhost:4444/?q=red');

		// not a good test - but an example
		cy.get('.ss-results-count-total').should('contain.text', 261);

		// has some facets
		cy.get('.ss-facets').should('have.lengthOf.at.least', 1);
	});
});

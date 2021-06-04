describe('Pagination', () => {
	beforeEach(() => {
		cy.visit('http://localhost:4444/');
	});

	it('can paginate', () => {
		cy.get('.ss__pagination .ss__pagination__page--active:first').should('have.text', '1');

		cy.get('.ss__pagination:first .ss__pagination__page--next').click();

		cy.get('.ss__pagination .ss__pagination__page--active:first').should('have.text', '2');

		cy.get('.ss__pagination:first .ss__pagination__page--previous').click();

		cy.get('.ss__pagination .ss__pagination__page--active:first').should('have.text', '1');
	});
});

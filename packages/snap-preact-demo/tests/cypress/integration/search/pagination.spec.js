describe('Pagination', () => {
	beforeEach(() => {
		cy.visit('http://localhost:4444/');
	});

	it('can paginate', () => {
		cy.get('.ss-pagination .ss-active:first').should('have.text', '1');

		cy.get('.ss-pagination:first .ss-page-next').click();

		cy.get('.ss-pagination .ss-active:first').should('have.text', '2');

		cy.get('.ss-pagination:first .ss-page-previous').click();

		cy.get('.ss-pagination .ss-active:first').should('have.text', '1');
	});
});

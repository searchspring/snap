describe('Pagination', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3333/');
	});

	it('can paginate', () => {
		cy.get('.ss-pagination .ss-pagination-row .ss-active:first').should('have.text', '1');

		cy.get('.ss-pagination:first .ss-page-next .ss-page-link').click();

		cy.get('.ss-pagination .ss-pagination-row .ss-active:first').should('have.text', '2');

		cy.get('.ss-pagination:first .ss-page-previous .ss-page-link').click();

		cy.get('.ss-pagination .ss-pagination-row .ss-active:first').should('have.text', '1');
	});
});

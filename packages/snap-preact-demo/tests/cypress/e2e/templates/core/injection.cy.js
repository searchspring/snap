describe('Injection', () => {
	beforeEach(() => {
		cy.visit('https://localhost:2222/templates/');
	});

	it('injects into main containers', () => {
		cy.get('#searchspring-content').should('be.empty');
		cy.get('#searchspring-layout').should('not.be.empty');
	});
});

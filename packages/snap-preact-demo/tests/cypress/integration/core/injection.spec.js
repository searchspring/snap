describe('Injection', () => {
	beforeEach(() => {
		cy.visit('http://localhost:4444/');
	});

	it('injects into main containers', () => {
		cy.get('#searchspring-sidebar').should('not.be.empty');
		cy.get('#searchspring-content').should('not.be.empty');
	});
});

describe('Injection', () => {
	beforeEach(() => {
		cy.visit('https://localhost:2222/snap/');
	});

	it('injects into main containers', () => {
		cy.get('#searchspring-sidebar').should('not.be.empty');
		cy.get('#searchspring-content').should('not.be.empty');
	});
});

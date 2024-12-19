describe('Pagination', () => {
	beforeEach(() => {
		// ensure infinite is disabled
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				controllers: {
					search: [
						{
							config: {
								settings: {
									infinite: undefined,
								},
							},
						},
					],
				},
			};
		});

		cy.visit('https://localhost:2222/');
	});

	it('can paginate', () => {
		cy.get('.ss__pagination .ss__pagination__page--active:first').should('have.text', '1');

		cy.get('.ss__pagination:first .ss__pagination__page--next').click();

		cy.get('.ss__pagination .ss__pagination__page--active:first').should('have.text', '2');

		cy.get('.ss__pagination:first .ss__pagination__page--previous').click();

		cy.get('.ss__pagination .ss__pagination__page--active:first').should('have.text', '1');
	});
});

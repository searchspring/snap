describe('Pagination', () => {
	beforeEach(() => {
		cy.visit('https://localhost:2222/snap/');
	});

	it('can paginate', () => {
		cy.snapController().then(({ store, config }) => {
			if (config.settings.infinite) {
				cy.get('.ss__load-more').should('exist');
				cy.get('.ss__load-more__progress__text').should('contain', store.pagination.end).should('contain', store.pagination.totalResults);
			} else {
				cy.get('.ss__pagination .ss__pagination__page--active:first').should('have.text', '1');

				cy.get('.ss__pagination:first .ss__pagination__page--next').click();

				cy.get('.ss__pagination .ss__pagination__page--active:first').should('have.text', '2');

				cy.get('.ss__pagination:first .ss__pagination__page--previous').click();

				cy.get('.ss__pagination .ss__pagination__page--active:first').should('have.text', '1');
			}
		});
	});
});

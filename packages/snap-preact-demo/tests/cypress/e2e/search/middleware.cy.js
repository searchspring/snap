describe('Middleware Test', () => {
	it('can modify core mappings and render them', () => {
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				controllers: {
					search: [
						{
							config: {
								middleware: {
									afterStore: ({ controller }) => {
										controller.store.results.forEach((result) => {
											(result.mappings.core.name = '!!!'), (result.mappings.core.price = 9.99);
										});
									},
								},
							},
						},
					],
				},
			};
		});
		cy.visit('https://localhost:2222/');

		cy.snapController().then(({ store }) => {
			store.results.forEach((result) => {
				// ensure store contains correct values
				expect(result.mappings.core.name).to.equal('!!!');
				expect(result.mappings.core.price).to.equal(9.99);

				expect(result.display.mappings.core.name).to.equal('!!!');
				expect(result.display.mappings.core.price).to.equal(9.99);
			});
		});

		// ensure elements rendered with correct middleware
		cy.get('.ss__result .ss__result__details__title').should('contain.text', '!!!');
		cy.get('.ss__result .ss__result__price').should('contain.text', '$9.99');
	});
});

describe('Infinite Setting Test', () => {
	it('has infinite functionality', () => {
		const backfill = 0;
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				controllers: {
					search: [
						{
							config: {
								settings: {
									infinite: {
										backfill,
									},
								},
							},
						},
					],
				},
			};
		});
		cy.visit('https://localhost:2222/snap/');

		cy.snapController().then(({ store }) => {
			expect(store.config.settings.infinite).to.deep.equal({ backfill: 0 });

			// initial page
			const resultsPerPage = store.results.length;
			cy.get('.ss__result').should('have.length', resultsPerPage);

			// load next page of results manually
			cy.snapController().then(({ store }) => {
				store.pagination.next.url.go({ history: 'replace' });
			});

			cy.snapController().then(({ store }) => {
				expect(store.results.length).to.equal(resultsPerPage * 2);
				expect(store.pagination.begin).to.equal(1);
				cy.get('.ss__result').should('have.length', resultsPerPage * 2);
			});

			// refresh page, should not backfill
			cy.reload().then(() => {
				cy.snapController().then(({ store }) => {
					expect(store.results.length).to.equal(resultsPerPage);
				});
			});
		});
	});

	it('resets results when applying a filter', () => {
		const backfill = 0;
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				controllers: {
					search: [
						{
							config: {
								settings: {
									infinite: {
										backfill,
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
			// initial page
			const resultsPerPage = store.results.length;
			cy.get('.ss__result').should('have.length', resultsPerPage);

			// load next page of results manually
			cy.snapController().then(({ store }) => {
				store.pagination.next.url.go({ history: 'replace' });
			});

			cy.snapController().then(({ store }) => {
				expect(store.results.length).to.equal(resultsPerPage * 2);
				expect(store.pagination.begin).to.equal(1);
				cy.get('.ss__result').should('have.length', resultsPerPage * 2);
			});

			let filterResults = 0;
			// apply a filter manually
			cy.snapController().then(({ store }) => {
				const value = store.facets[0].values[0];
				value.url.go();
				filterResults = value.count > resultsPerPage ? resultsPerPage : value.count;
			});

			cy.snapController().then(({ store }) => {
				expect(store.results.length).to.equal(filterResults);
				expect(store.pagination.begin).to.equal(1);
				cy.get('.ss__result').should('have.length', filterResults);
			});
		});
	});

	it('resets results when setting a sort', () => {
		const backfill = 0;
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				controllers: {
					search: [
						{
							config: {
								settings: {
									infinite: {
										backfill,
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
			// initial page
			const resultsPerPage = store.results.length;
			cy.get('.ss__result').should('have.length', resultsPerPage);

			// load next page of results manually
			cy.snapController().then(({ store }) => {
				store.pagination.next.url.go({ history: 'replace' });
			});

			cy.snapController().then(({ store }) => {
				expect(store.results.length).to.equal(resultsPerPage * 2);
				expect(store.pagination.begin).to.equal(1);
				cy.get('.ss__result').should('have.length', resultsPerPage * 2);
			});

			// apply a sort manually
			cy.snapController().then(({ store }) => {
				store.sorting.options[1].url.go();
			});

			cy.snapController().then(({ store }) => {
				expect(store.results.length).to.equal(resultsPerPage);
				expect(store.pagination.begin).to.equal(1);
				cy.get('.ss__result').should('have.length', resultsPerPage);
			});
		});
	});

	it('resets results when setting a per page option', () => {
		const backfill = 0;
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				controllers: {
					search: [
						{
							config: {
								settings: {
									infinite: {
										backfill,
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
			// initial page
			const resultsPerPage = store.results.length;
			cy.get('.ss__result').should('have.length', resultsPerPage);

			// load next page of results manually
			cy.snapController().then(({ store }) => {
				store.pagination.next.url.go({ history: 'replace' });
			});

			cy.snapController().then(({ store }) => {
				expect(store.results.length).to.equal(resultsPerPage * 2);
				expect(store.pagination.begin).to.equal(1);
				cy.get('.ss__result').should('have.length', resultsPerPage * 2);
			});

			let pageSize = 0;
			// set a per page manually
			cy.snapController().then(({ store }) => {
				const pageSizeOption = store.pagination.pageSizeOptions[0];
				pageSize = pageSizeOption.value;
				pageSizeOption.url.go();
			});

			cy.snapController().then(({ store }) => {
				expect(store.results.length).to.equal(pageSize);
				expect(store.pagination.begin).to.equal(1);
				cy.get('.ss__result').should('have.length', pageSize);
			});

			// load next page of results manually
			cy.snapController().then(({ store }) => {
				store.pagination.next.url.go({ history: 'replace' });
			});

			// ensure number of products is correct
			cy.snapController().then(({ store }) => {
				expect(store.results.length).to.equal(pageSize * 2);
				expect(store.pagination.begin).to.equal(1);
				cy.get('.ss__result').should('have.length', pageSize * 2);
			});
		});
	});

	it('has backfill results upon reload', () => {
		const backfill = 2;
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				controllers: {
					search: [
						{
							config: {
								settings: {
									infinite: {
										backfill,
									},
								},
							},
						},
					],
				},
			};
		});
		cy.visit('https://localhost:2222/snap/');
		cy.snapController().then(({ store }) => {
			expect(store.config.settings.infinite).to.deep.equal({ backfill });

			// initial page
			const resultsPerPage = store.results.length;
			cy.get('.ss__result').should('have.length', resultsPerPage);

			// load next page of results manually
			cy.snapController().then(({ store }) => {
				store.pagination.next.url.go({ history: 'replace' });
			});

			cy.waitUntil(() => cy.get('.ss__result').should('have.length', resultsPerPage * 2));
			cy.snapController().then(({ store }) => {
				expect(store.results.length).to.equal(resultsPerPage * 2);
				expect(store.pagination.begin).to.equal(1);
			});

			// refresh page, should backfill
			cy.reload().then(() => {
				cy.snapController().then(({ store }) => {
					expect(store.results.length).to.equal(resultsPerPage * 2);
				});
			});

			// load next page of results manually
			cy.snapController().then(({ store }) => {
				store.pagination.next.url.go({ history: 'replace' });
			});

			cy.waitUntil(() => cy.get('.ss__result').should('have.length', resultsPerPage * 3));
			cy.snapController().then(({ store }) => {
				expect(store.results.length).to.equal(resultsPerPage * 3);
				expect(store.pagination.begin).to.equal(1);
			});

			// refresh page, should NOT backfill again due to page > backfill and is at page 1
			cy.reload().then(() => {
				cy.snapController().then(({ store }) => {
					expect(store.results.length).to.equal(resultsPerPage);
					expect(store.pagination.current.number).to.equal(1);
				});
			});
		});
	});
});

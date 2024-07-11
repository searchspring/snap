/**
 * Finder e2e tests will only work with native <select> elements.
 *
 * config.pages[].finderIds must contain a list of all finder id's to be tested on the page.
 */
const config = {
	pages: [{ url: 'https://localhost:2222/snap/finder.html', finderIds: ['finder', 'finder_hierarchy'] }],
	disableGA: '', // disable google analytic events (example: 'UA-123456-1')
	selectors: {
		finder: {
			wrapper: '.finder-container',
			findButton: 'button.searchspring-finder_submit',
		},
	},
};

config?.pages?.forEach((page, _i) => {
	describe(`${page.url || _i}`, () => {
		page.finderIds.forEach((id, _i) => {
			let type;

			describe(`Finder id: ${id || _i}`, () => {
				it('has valid config', () => {
					cy.wrap(page).its('url').should('have.length.at.least', 1);
					cy.visit(page.url);

					if (config.disableGA) {
						window[`ga-disable-${config.disableGA}`] = true;
					}
				});

				it('renders', () => {
					cy.snapController(id).then((controller) => {
						const targetSelector = controller.targeters[id].targets.map((target) => target.selector).join(',');

						// assert target selector found on page
						cy.get(targetSelector).first().should('exist');

						if (config.selectors?.finder?.wrapper) {
							// assert target selector has had component rendered into it
							cy.get(targetSelector).first().find(config.selectors.finder.wrapper).first().should('exist');
						}
					});
				});

				it('contains correct number of selections', () => {
					cy.snapController(id).then((controller) => {
						const targetSelector = controller.targeters[id].targets.map((target) => target.selector).join(',');
						const { store } = controller;

						cy.get(targetSelector).first().find('select').should('have.length', store.selections.length);
					});
				});

				it('determines hierarchy or non-hierarchy type', function () {
					cy.snapController(id).then((controller) => {
						const { store } = controller;
						if (store.selections[0].display === 'hierarchy') {
							type = 'hierarchy';
							expect(store.selections[0].display).to.equal('hierarchy');
						} else {
							type = 'non-hierarchy';
							expect(store.selections[0].display).to.not.equal('hierarchy');
						}
					});
				});

				describe(`Non-Hierarchy Tests`, () => {
					it('contains all selections', function () {
						if (type !== 'non-hierarchy') this.skip();
						cy.snapController(id).then((controller) => {
							const { store } = controller;
							const targetSelector = controller.targeters[id].targets.map((target) => target.selector).join(',');

							// first select should not be disabled
							cy.get(targetSelector).first().find('select').should('have.length', store.selections.length);

							// all selections should be enabled
							cy.get(targetSelector)
								.first()
								.find('select')
								.each((select, _i) => {
									expect(select.prop('disabled')).to.be.false;
								});
						});
					});

					it('can make all selections', function () {
						if (type !== 'non-hierarchy') this.skip();
						cy.snapController(id).then((controller) => {
							const targetSelector = controller.targeters[id].targets.map((target) => target.selector).join(',');
							controller.store.selections.map((_, index) => {
								cy.get(targetSelector)
									.find('select')
									.eq(index)
									.then((select) => {
										cy.snapController(id).then(({ store }) => {
											// value with the most options
											const options = store.selections[index].data.sort((a, b) => b.count - a.count);
											const valueToSelect = options[0]?.value;
											expect(valueToSelect).to.exist;

											cy.get(select).select(valueToSelect, { force: true }).should('have.value', valueToSelect);

											cy.snapController(id).then(({ store }) => {
												expect(store.selections[index].selected).to.equal(valueToSelect);
											});
										});
									});
							});
						});
					});

					it('can change first selection', function () {
						if (type !== 'non-hierarchy') this.skip();

						cy.snapController(id).then((controller) => {
							const targetSelector = controller.targeters[id].targets.map((target) => target.selector).join(',');

							// ensure previous test has a selection
							const hasSelected = controller.store.selections.filter((selection) => selection.selected).length >= 1;
							if (!hasSelected) this.skip();

							// get first dropdown that has been selected
							const firstSelectedIndex = controller.store.selections.reduce((acc, selection, index) => {
								if (acc === null && selection.filtered) {
									acc = index;
								}
								return acc;
							}, null);
							expect(firstSelectedIndex).to.not.equal(null);

							cy.get(targetSelector)
								.find('select')
								.eq(firstSelectedIndex)
								.then((select) => {
									cy.snapController(id).then(({ store }) => {
										// value with the most options and is not selected
										const valueToSelect = store.selections[firstSelectedIndex].data
											.filter((selection) => !selection.selected)
											.sort((a, b) => b.count - a.count)[0]?.value;
										expect(valueToSelect).to.exist;

										cy.get(select).select(valueToSelect, { force: true }).should('have.value', valueToSelect);

										cy.snapController(id).then(({ store }) => {
											expect(store.selections[firstSelectedIndex].selected).to.equal(valueToSelect);
										});
									});
								});
						});
					});

					it('can click the find button', function () {
						if (type !== 'non-hierarchy') this.skip();
						if (!config.selectors?.finder?.findButton) this.skip();

						cy.snapController(id).then((controller) => {
							const targetSelector = controller.targeters[id].targets.map((target) => target.selector).join(',');
							const url = controller.urlManager.href;
							cy.get(targetSelector).find(config.selectors?.finder?.findButton).should('exist').click({ force: true });

							cy.url().should('contain', url);

							const findButtonUrl = controller.store.config.url;
							if (findButtonUrl) {
								expect(url).to.contain(findButtonUrl);
							}
						});
					});
				});

				describe(`Hierarchy Tests`, () => {
					it('contains all selections if levels is defined', function () {
						if (type !== 'hierarchy') this.skip();
						cy.snapController(id).then((controller) => {
							const { store } = controller;
							const hasLevels = store.config.fields.filter((field) => 'levels' in field).length > 0;
							if (!hasLevels) {
								this.skip();
							}
							const targetSelector = controller.targeters[id].targets.map((target) => target.selector).join(',');

							// first select should not be disabled
							cy.get(targetSelector).first().find('select').first().should('not.be.disabled');

							// remaining select should be disabled
							cy.get(targetSelector).find('select').not(':first').should('be.disabled');
						});
					});

					it('contains single selection if levels is not defined', function () {
						if (type !== 'hierarchy') this.skip();
						cy.snapController(id).then((controller) => {
							const { store } = controller;
							const hasLevels = store.config.fields.filter((field) => 'levels' in field).length > 0;
							if (hasLevels) {
								this.skip();
							}
							const targetSelector = controller.targeters[id].targets.map((target) => target.selector).join(',');

							// remaining select should be disabled
							cy.get(targetSelector).find('select').should('not.be.disabled');
						});
					});

					it('can make all selections in order', function () {
						if (type !== 'hierarchy') this.skip();
						cy.snapController(id).then((controller) => {
							const targetSelector = controller.targeters[id].targets.map((target) => target.selector).join(',');
							controller.store.selections.map((_, index) => {
								cy.get(targetSelector)
									.find('select')
									.eq(index)
									.then((select) => {
										cy.snapController(id).then(({ store }) => {
											// value with the most options
											const options = store.selections[index].data.sort((a, b) => b.count - a.count);
											const valueToSelect = options[0]?.value;
											expect(valueToSelect).to.exist;

											cy.get(select).select(valueToSelect, { force: true }).should('have.value', valueToSelect);

											cy.snapController(id).then(({ store }) => {
												expect(store.selections[index].selected).to.equal(valueToSelect);
											});
										});
									});
							});
						});
					});

					it('can change first selection', function () {
						if (type !== 'hierarchy') this.skip();

						cy.snapController(id).then((controller) => {
							const targetSelector = controller.targeters[id].targets.map((target) => target.selector).join(',');

							// ensure previous test has a selection
							const hasSelected = controller.store.selections.filter((selection) => selection.selected).length >= 1;
							if (!hasSelected) this.skip();

							// get first dropdown that has been selected
							// hierarchy will enforce selection in order so we can assume this is always the first dropdown
							const firstSelectedIndex = 0;

							cy.get(targetSelector)
								.find('select')
								.eq(firstSelectedIndex)
								.then((select) => {
									cy.snapController(id).then(({ store }) => {
										// value with the most options and is not selected
										const valueToSelect = store.selections[firstSelectedIndex].data
											.filter((selection) => !selection.selected)
											.sort((a, b) => b.count - a.count)[0]?.value;
										expect(valueToSelect).to.exist;

										cy.get(select).select(valueToSelect, { force: true }).should('have.value', valueToSelect);

										cy.snapController(id).then(({ store }) => {
											expect(store.selections[firstSelectedIndex].selected).to.equal(valueToSelect);

											// ensure other previously selected dropdowns have been reset
											store.selections.forEach((selection, index) => {
												if (index !== firstSelectedIndex) {
													expect(selection.selected).to.equal('');
												}
											});
										});
									});
								});
						});
					});

					it('can click the find button', function () {
						if (type !== 'hierarchy') this.skip();
						if (!config.selectors?.finder?.findButton) this.skip();

						cy.snapController(id).then((controller) => {
							const targetSelector = controller.targeters[id].targets.map((target) => target.selector).join(',');
							const url = controller.urlManager.href;
							cy.get(targetSelector).find(config.selectors?.finder?.findButton).should('exist').click({ force: true });

							cy.url().should('contain', url);

							const findButtonUrl = controller.store.config.url;
							if (findButtonUrl) {
								expect(url).to.contain(findButtonUrl);
							}
						});
					});
				});
			});
		});
	});
});

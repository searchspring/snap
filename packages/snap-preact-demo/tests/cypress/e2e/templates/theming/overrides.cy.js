const config = {
	url: 'https://localhost:2222/templates',
	selectors: {
		titleElem: '.ss__search-header__title.ss__search-header__title--results',
		subtitleElem: '.ss__search-header__subtitle',
		topToolbarElem: '.ss__search__header-section__toolbar--top-toolbar',
		bottomToolbarElem: '.ss__search__content__toolbar--bottom-toolbar',
		pagination: '.ss__pagination',
		layoutSelector: '.ss__layout__list',
		perpage: '.ss__per-page',
	},
};

describe('Theme overrides work', () => {
	beforeEach(() => {
		//clear local storage before each test
		//in order to prevent theme storage from overrriding settings...
		cy.clearLocalStorage();
		cy.clearAllSessionStorage();
	});

	describe('Theme component overrides work', () => {
		it('can use component overrides', () => {
			cy.on('window:before:load', (win) => {
				win.mergeSnapConfig = {
					themes: {
						custom: {
							extends: 'bocachica',
							overrides: {
								components: {
									searchHeader: {
										titleText: 'custom title text',
										subtitleText: 'custom subtitle text',
										hideExpandedSearchText: true,
									},
								},
							},
						},
					},
					search: {
						targets: [
							{
								selector: '#searchspring-layout',
								theme: 'custom',
								component: 'Search',
							},
						],
					},
				};
			});

			cy.visit('https://localhost:2222/templates/');

			cy.snapController().then(({ store }) => {
				cy.get(config.selectors.titleElem).should('have.text', 'custom title text');
				cy.get(config.selectors.subtitleElem).should('have.text', 'custom subtitle text');
			});
		});

		it('can use cascading component overrides & named components', () => {
			cy.on('window:before:load', (win) => {
				win.mergeSnapConfig = {
					themes: {
						custom: {
							extends: 'bocachica',
							overrides: {
								components: {
									'search searchHeader': {
										titleText: 'custom title text',
										subtitleText: 'custom subtitle text',
										hideExpandedSearchText: true,
									},

									'searchHorizontal searchHeader': {
										titleText: 'dont use this title text',
										subtitleText: 'dont use this subtitle text',
										hideExpandedSearchText: true,
									},

									'search toolbar.top': {
										layout: ['searchHeader', 'paginationInfo', 'pagination', 'sortBy', 'perPage'],
									},

									'search toolbar.bottom': {
										layout: ['paginationInfo', 'sortBy', 'perPage'],
									},
								},
							},
						},
					},
					search: {
						targets: [
							{
								selector: '#searchspring-layout',
								theme: 'custom',
								component: 'Search',
							},
						],
					},
				};
			});

			cy.visit('https://localhost:2222/templates/');

			cy.snapController().then(({ store }) => {
				cy.get(config.selectors.titleElem).should('have.text', 'custom title text');
				cy.get(config.selectors.subtitleElem).should('have.text', 'custom subtitle text');

				cy.get(`${config.selectors.topToolbarElem} ${config.selectors.pagination}`).should('exist');
				cy.get(`${config.selectors.bottomToolbarElem} ${config.selectors.pagination}`).should('not.exist');
			});
		});
	});

	describe('Theme layoutOptions work & override the base overrides', () => {
		it('can set use component overrides in layoutoptions overriding the global overrides', () => {
			cy.on('window:before:load', (win) => {
				win.mergeSnapConfig = {
					themes: {
						custom: {
							extends: 'bocachica',
							overrides: {
								components: {
									searchHeader: {
										titleText: 'global title text',
										subtitleText: 'global subtitle text',
										hideExpandedSearchText: true,
									},

									'search toolbar.top': {
										layout: ['searchHeader', 'paginationInfo', 'layoutSelector', 'sortBy', 'perPage'],
									},
									search: {
										layoutOptions: [
											{
												default: true,
												value: '1',
												label: 'one',
												overrides: {
													components: {
														searchHeader: {
															titleText: 'title text one',
															subtitleText: 'subtitle text one',
														},
													},
												},
											},
											{
												default: false,
												value: '2',
												label: 'two',
												overrides: {
													components: {
														searchHeader: {
															titleText: 'title text two',
															subtitleText: 'subtitle text two',
														},
													},
												},
											},
										],
									},
								},
							},
						},
					},
					search: {
						targets: [
							{
								selector: '#searchspring-layout',
								theme: 'custom',
								component: 'Search',
							},
						],
					},
				};
			});

			cy.visit('https://localhost:2222/templates/');

			cy.get(`${config.selectors.layoutSelector} .ss__list__option--1`).should('exist');
			cy.get(`${config.selectors.layoutSelector} .ss__list__option--1`).should('exist').should('have.class', 'ss__list__option--selected');

			cy.snapController().then(({ store }) => {
				cy.get(config.selectors.titleElem).should('have.text', 'title text one');
				cy.get(config.selectors.subtitleElem).should('have.text', 'subtitle text one');
			});

			cy.get(`${config.selectors.layoutSelector} .ss__list__option--2`).should('exist').click();

			cy.snapController().then(({ store }) => {
				cy.get(`${config.selectors.layoutSelector} .ss__list__option--2`).should('exist').should('have.class', 'ss__list__option--selected');
				cy.get(config.selectors.titleElem).should('have.text', 'title text two');
				cy.get(config.selectors.subtitleElem).should('have.text', 'subtitle text two');
			});
		});

		it('can set use cascading component overrides & named components', () => {
			cy.on('window:before:load', (win) => {
				win.mergeSnapConfig = {
					themes: {
						custom: {
							extends: 'bocachica',
							overrides: {
								components: {
									searchHeader: {
										titleText: 'global title text',
										subtitleText: 'global subtitle text',
										hideExpandedSearchText: true,
									},
									'search toolbar.top': {
										layout: ['searchHeader', 'layoutSelector', 'pagination', 'perPage'],
									},
									search: {
										layoutOptions: [
											{
												default: true,
												value: '1',
												label: 'one',
												overrides: {
													components: {
														'search searchHeader': {
															titleText: 'title text one',
															subtitleText: 'subtitle text one',
														},
														'horizontalSearch searchHeader': {
															titleText: 'nope',
															subtitleText: 'nope',
														},
														'search toolbar.top': {
															layout: ['searchHeader', 'layoutSelector', 'pagination', 'perPage'],
														},

														'search toolbar.bottom': {
															layout: ['layoutSelector', 'sortBy'],
														},
													},
												},
											},
											{
												default: false,
												value: '2',
												label: 'two',
												overrides: {
													components: {
														'search searchHeader': {
															titleText: 'title text two',
															subtitleText: 'subtitle text two',
														},

														'horizontalSearch searchHeader': {
															titleText: 'nope',
															subtitleText: 'nope',
														},

														'search toolbar.top': {
															layout: ['searchHeader', 'layoutSelector', 'sortBy'],
														},

														'search toolbar.bottom': {
															layout: ['layoutSelector', 'pagination', 'perPage'],
														},
													},
												},
											},
										],
									},
								},
							},
						},
					},
					search: {
						targets: [
							{
								selector: '#searchspring-layout',
								theme: 'custom',
								component: 'Search',
							},
						],
					},
				};
			});

			cy.visit('https://localhost:2222/templates/');

			cy.get(`${config.selectors.layoutSelector} .ss__list__option--1`).should('exist');
			cy.get(`${config.selectors.layoutSelector} .ss__list__option--1`).should('exist').should('have.class', 'ss__list__option--selected');

			cy.snapController().then(({ store }) => {
				cy.get(config.selectors.titleElem).should('have.text', 'title text one');
				cy.get(config.selectors.subtitleElem).should('have.text', 'subtitle text one');

				cy.get(`${config.selectors.topToolbarElem} ${config.selectors.pagination}`).should('exist');
				cy.get(`${config.selectors.bottomToolbarElem} ${config.selectors.pagination}`).should('not.exist');

				cy.get(`${config.selectors.topToolbarElem} ${config.selectors.perpage}`).should('exist');
				cy.get(`${config.selectors.bottomToolbarElem} ${config.selectors.perpage}`).should('not.exist');
			});

			cy.get(`${config.selectors.layoutSelector} .ss__list__option--2`).should('exist').first().click();

			cy.snapController().then(({ store }) => {
				cy.get(`${config.selectors.layoutSelector} .ss__list__option--2`).should('exist').should('have.class', 'ss__list__option--selected');
				cy.get(config.selectors.titleElem).should('have.text', 'title text two');
				cy.get(config.selectors.subtitleElem).should('have.text', 'subtitle text two');

				cy.get(`${config.selectors.topToolbarElem} ${config.selectors.pagination}`).should('not.exist');
				cy.get(`${config.selectors.bottomToolbarElem} ${config.selectors.pagination}`).should('exist');

				cy.get(`${config.selectors.topToolbarElem} ${config.selectors.perpage}`).should('not.exist');
				cy.get(`${config.selectors.bottomToolbarElem} ${config.selectors.perpage}`).should('exist');
			});
		});
	});

	describe('Theme responsive layoutOptions work & override the layoutOptions && base overrides', () => {
		it('can set use component overrides in layoutoptions overriding the global overrides', () => {
			cy.on('window:before:load', (win) => {
				win.mergeSnapConfig = {
					themes: {
						custom: {
							extends: 'bocachica',
							variables: {
								breakpoints: {
									mobile: 768,
									tablet: 991,
									desktop: 1299,
								},
							},
							overrides: {
								components: {
									'toolbar.top': {
										layout: ['layoutSelector', 'searchHeader'],
									},
									searchHeader: {
										titleText: 'global title text',
										subtitleText: 'global subtitle text',
										hideExpandedSearchText: true,
									},
									search: {
										layoutOptions: [
											{
												default: true,
												value: '1',
												label: 'one',
												overrides: {
													components: {
														searchHeader: {
															titleText: 'title text one',
															subtitleText: 'subtitle text one',
															hideExpandedSearchText: true,
														},
													},
												},
											},
											{
												default: false,
												value: '2',
												label: 'two',
												overrides: {
													components: {
														searchHeader: {
															titleText: 'title text two',
															subtitleText: 'subtitle text two',
															hideExpandedSearchText: true,
														},
													},
												},
											},
										],
									},
								},

								responsive: {
									mobile: {
										searchHeader: {
											titleText: '0 - 767',
											hideExpandedSearchText: true,
										},
										search: {
											layoutOptions: [
												{
													default: true,
													value: '1',
													label: 'one',
													overrides: {
														components: {
															searchHeader: {
																titleText: 'layout1 0 - 767',
															},
														},
													},
												},
												{
													default: false,
													value: '2',
													label: 'two',
													overrides: {
														components: {
															searchHeader: {
																titleText: 'layout2 0 - 767',
															},
														},
													},
												},
											],
										},
									},
									tablet: {
										searchHeader: {
											titleText: '767 - 991',
											hideExpandedSearchText: true,
										},
										search: {
											layoutOptions: [
												{
													default: true,
													value: '1',
													label: 'one',
													overrides: {
														components: {
															searchHeader: {
																titleText: 'layout1 767 - 991',
															},
														},
													},
												},
												{
													default: false,
													value: '2',
													label: 'two',
													overrides: {
														components: {
															searchHeader: {
																titleText: 'layout2 767 - 991',
															},
														},
													},
												},
											],
										},
									},
									desktop: {
										//only overrides when layoutoptions, if its also in a layout options
										searchHeader: {
											titleText: '991 - 1299',
											hideExpandedSearchText: true,
										},
									},
								},
							},
						},
					},
					search: {
						targets: [
							{
								selector: '#searchspring-layout',
								theme: 'custom',
								component: 'Search',
							},
						],
					},
				};
			});

			cy.visit('https://localhost:2222/templates/');

			cy.viewport(1500, 1000);

			cy.visit('https://localhost:2222/templates/');

			cy.snapController().then(({ store }) => {
				cy.get(config.selectors.titleElem).should('have.text', 'title text one');
				cy.get(config.selectors.subtitleElem).should('have.text', 'subtitle text one');
			});

			cy.viewport(1298, 1000);

			cy.snapController().then(({ store }) => {
				cy.get(config.selectors.titleElem).should('have.text', 'title text one');
				cy.get(config.selectors.subtitleElem).should('have.text', 'subtitle text one');
			});

			cy.viewport(990, 1000);

			cy.snapController().then(({ store }) => {
				cy.get(config.selectors.titleElem).should('have.text', 'layout1 767 - 991');
				cy.get(config.selectors.subtitleElem).should('have.text', 'global subtitle text');
			});

			cy.viewport(766, 1000);

			cy.snapController().then(({ store }) => {
				cy.get(config.selectors.titleElem).should('have.text', 'layout1 0 - 767');
				cy.get(config.selectors.subtitleElem).should('have.text', 'global subtitle text');
			});
		});
	});
});

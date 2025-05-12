const config = {
	url: 'https://localhost:2222/templates',
	selectors: {
		titleElem: '.ss__search-header__title',
	},
};

describe('Theme variables work', () => {
	it('has default breakpoints from extended theme', () => {
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				themes: {
					custom: {
						extends: 'bocachica',
						variables: {
							breakpoints: {
								mobile: 767,
								tablet: 991,
								desktop: 1299,
							},
						},
						overrides: {
							components: {
								searchHeader: {
									titleText: 'default title text',
								},
								search: {
									toggleSidebarStartClosed: false,
								},
							},
							responsive: {
								mobile: {
									searchHeader: {
										titleText: '0 - 767',
									},
								},
								tablet: {
									searchHeader: {
										titleText: '767 - 991',
									},
								},
								desktop: {
									searchHeader: {
										titleText: '991 - 1299',
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

		cy.viewport(1500, 1000);

		cy.visit('https://localhost:2222/templates/');

		cy.snapController().then(({ store }) => {
			cy.get(config.selectors.titleElem).should('have.text', 'default title text');
		});

		cy.viewport(1298, 1000);

		cy.snapController().then(({ store }) => {
			cy.get(config.selectors.titleElem).should('have.text', '991 - 1299');
		});

		cy.viewport(990, 1000);

		cy.snapController().then(({ store }) => {
			cy.get(config.selectors.titleElem).should('have.text', '767 - 991');
		});

		cy.viewport(766, 1000);

		cy.snapController().then(({ store }) => {
			cy.get(config.selectors.titleElem).should('have.text', '0 - 767');
		});
	});

	it('can set custom breakpoints', () => {
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				themes: {
					custom: {
						extends: 'bocachica',
						variables: {
							breakpoints: {
								mobile: 540,
								tablet: 767,
								desktop: 1200,
							},
						},
						overrides: {
							components: {
								searchHeader: {
									titleText: 'default title text',
								},
								search: {
									toggleSidebarStartClosed: false,
								},
							},
							responsive: {
								mobile: {
									searchHeader: {
										titleText: '0 - 540',
									},
								},
								tablet: {
									searchHeader: {
										titleText: '540 - 767',
									},
								},
								desktop: {
									searchHeader: {
										titleText: '767 - 1200',
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

		cy.viewport(1500, 1000);

		cy.visit('https://localhost:2222/templates/');

		cy.snapController().then(({ store }) => {
			cy.get(config.selectors.titleElem).should('have.text', 'default title text');
		});

		cy.viewport(1199, 1000);

		cy.snapController().then(({ store }) => {
			cy.get(config.selectors.titleElem).should('have.text', '767 - 1200');
		});

		cy.viewport(766, 1000);

		cy.snapController().then(({ store }) => {
			cy.get(config.selectors.titleElem).should('have.text', '540 - 767');
		});

		cy.viewport(539, 1000);

		cy.snapController().then(({ store }) => {
			cy.get(config.selectors.titleElem).should('have.text', '0 - 540');
		});
	});

	it('used default colors from extended theme', () => {
		//use select for primary, secondary, and accent coloring
		// and facet grid options for text
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				themes: {
					custom: {
						extends: 'bocachica',
						// variables: {
						// colors: {
						// text: '#222222',
						// primary: '#202223',
						// secondary: '#6d7175',
						// accent: '#3a23ad',
						//     }
						// },
						breakpoints: {
							mobile: 767,
							tablet: 991,
							desktop: 1299,
						},
						overrides: {
							components: {
								search: {
									toggleSidebarStartClosed: false,
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
			//accent
			cy.get('.ss__select .ss__dropdown .ss__icon').should('have.css', 'fill', 'rgb(58, 35, 173)');

			// cypress converts all css colors to rgb...
			//secondary
			cy.get('.ss__select .ss__select__select .ss__select__select__option').should('have.css', 'color', 'rgb(109, 113, 117)');
			//primary
			cy.get('.ss__button').should('have.css', 'color', 'rgb(32, 34, 35)');
			//text
			cy.get('.ss__facet-grid-options a').should('have.css', 'color', 'rgb(34, 34, 34)');
		});
	});

	it('used custom colors from theme', () => {
		//use select for primary, secondary, and accent coloring
		// and facet grid options for text
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				themes: {
					custom: {
						extends: 'bocachica',
						variables: {
							colors: {
								text: 'rgb(22, 22, 255)',
								primary: 'rgb(33, 33, 255)',
								secondary: 'rgb(44, 44, 255)',
								accent: 'rgb(55, 55, 255)',
							},
						},
						overrides: {
							components: {
								search: {
									toggleSidebarStartClosed: false,
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
			//accent
			cy.get('.ss__select .ss__dropdown .ss__icon').should('have.css', 'fill', 'rgb(55, 55, 255)');

			// cypress converts all css colors to rgb...
			//secondary
			cy.get('.ss__select .ss__select__select .ss__select__select__option').should('have.css', 'color', 'rgb(44, 44, 255)');
			//primary
			cy.get('.ss__button').should('have.css', 'color', 'rgb(33, 33, 255)');
			//text
			cy.get('.ss__facet-grid-options a').should('have.css', 'color', 'rgb(22, 22, 255)');
		});
	});
});

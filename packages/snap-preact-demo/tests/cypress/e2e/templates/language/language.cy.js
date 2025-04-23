const config = {
	url: 'https://localhost:2222/templates',
	selectors: {
		sidebarTitleElem: '.ss__sidebar__title',
		titleElem: '.ss__search-header__title.ss__search-header__title--results',
	},
};

describe('Templates Language settings', () => {
	beforeEach(() => {
		//clear local storage before each test
		//in order to prevent theme storage from overrriding settings...
		cy.clearLocalStorage();
	});

	describe('Theme language settings work', () => {
		it('can use english language', () => {
			cy.on('window:before:load', (win) => {
				win.mergeSnapConfig = {
					config: {
						siteId: '8uyt2m',
						language: 'en',
					},
					themes: {
						custom: {
							extends: 'base',
						},
						global: {
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
				cy.get(config.selectors.sidebarTitleElem).should(($el) => expect($el.text().trim()).to.equal('Filters'));
			});
		});

		it('can use french translations', () => {
			cy.on('window:before:load', (win) => {
				win.mergeSnapConfig = {
					config: {
						language: 'fr',
						siteId: '8uyt2m',
					},
					themes: {
						custom: {
							extends: 'base',
						},
						global: {
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
				cy.get(config.selectors.sidebarTitleElem).should(($el) => expect($el.text().trim()).to.equal(`Filtres`));
			});
		});

		it('can supply custom translations', () => {
			cy.on('window:before:load', (win) => {
				win.mergeSnapConfig = {
					config: {
						language: 'fr',
						siteId: '8uyt2m',
					},
					translations: {
						fr: {
							searchHeader: {
								titleText: {
									value: 'custom val',
								},
							},
						},
					},
				};
			});

			cy.visit('https://localhost:2222/templates/');

			cy.snapController().then(({ store }) => {
				cy.get(config.selectors.titleElem).should(($el) => expect($el.text().trim()).to.equal(`custom val`));
			});
		});
	});
});

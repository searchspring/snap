const config = {
	url: 'https://localhost:2222/templates',
	selectors: {
		titleElem: '.ss__search-header__title.ss__search-header__title--results',
		subtitleElem: '.ss__search-header__title.ss__search-header__title--subtitle',
		topToolbarElem: '.ss__search__content__toolbar--top-toolbar',
		bottomToolbarElem: '.ss__search__content__toolbar--bottom-toolbar',
		pagination: '.ss__pagination',
		layoutSelector: '.ss__toolbar__layout-selector',
		perpage: '.ss__per-page',
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
				};
			});

			cy.visit('https://localhost:2222/templates/');

			cy.snapController().then(({ store }) => {
				cy.get(config.selectors.titleElem).should(($el) =>
					expect($el.text().trim()).to.equal('Showing  1 - 24 of  \n                4445 \n                results')
				);
			});
		});

		it('can use french translations', () => {
			cy.on('window:before:load', (win) => {
				win.mergeSnapConfig = {
					config: {
						language: 'fr',
						siteId: '8uyt2m',
					},
				};
			});

			cy.visit('https://localhost:2222/templates/');

			cy.snapController().then(({ store }) => {
				cy.get(config.selectors.titleElem).should(($el) =>
					expect($el.text().trim()).to.equal(`Montrant  1 - 24 de  \n                4445 \n                résultats`)
				);
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

const config = {
	url: 'https://localhost:2222/templates',
};

describe('plugins work based on plaform setting', () => {
	it('has default plugins registered by default', () => {
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				config: {
					siteId: 'atkzs2',
					language: 'en',
					currency: 'usd',
					platform: undefined, // defaults to 'other'
				},
				search: {
					targets: [
						{
							selector: '#searchspring-layout',
							component: 'Search',
						},
					],
				},
			};
		});

		cy.visit('https://localhost:2222/templates/');

		cy.snapController().then((controller) => {
			const expectedPluginList = [
				'pluginBackgroundFilters', // common
				'pluginScrollToTop', // common
				'pluginLogger', // common
				'pluginAddToCart', // common (when using 'other' platform)
			];
			expect(controller.config.plugins.length).to.equal(expectedPluginList.length);

			controller.config.plugins.forEach((plugin, idx) => {
				expect(plugin[0].name).to.equal(expectedPluginList[idx]);
			});
		});
	});

	it('has default plugins registered when unsupported platform supplied', () => {
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				config: {
					siteId: 'atkzs2',
					language: 'en',
					currency: 'usd',
					platform: 'somethingRandom',
				},
				search: {
					targets: [
						{
							selector: '#searchspring-layout',
							component: 'Search',
						},
					],
				},
			};
		});

		cy.visit('https://localhost:2222/templates/');

		cy.snapController().then((controller) => {
			const expectedPluginList = [
				'pluginBackgroundFilters', // common
				'pluginScrollToTop', // common
				'pluginLogger', // common
			];
			expect(controller.config.plugins.length).to.equal(expectedPluginList.length);

			controller.config.plugins.forEach((plugin, idx) => {
				expect(plugin[0].name).to.equal(expectedPluginList[idx]);
			});
		});
	});

	it('has default plugins registered when "other" platform supplied', () => {
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				config: {
					siteId: 'atkzs2',
					language: 'en',
					currency: 'usd',
					platform: 'other',
				},
				search: {
					targets: [
						{
							selector: '#searchspring-layout',
							component: 'Search',
						},
					],
				},
			};
		});

		cy.visit('https://localhost:2222/templates/');

		cy.snapController().then((controller) => {
			const expectedPluginList = [
				'pluginBackgroundFilters', // common
				'pluginScrollToTop', // common
				'pluginLogger', // common
				'pluginAddToCart', // common (when using 'other' platform)
			];
			expect(controller.config.plugins.length).to.equal(expectedPluginList.length);

			controller.config.plugins.forEach((plugin, idx) => {
				expect(plugin[0].name).to.equal(expectedPluginList[idx]);
			});
		});
	});

	it('adds common addToCart plugin when configured with "other" platform supplied', () => {
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				config: {
					siteId: 'atkzs2',
					language: 'en',
					currency: 'usd',
					platform: 'other',
				},
				plugins: {
					common: {
						addToCart: {
							function: () => {
								console.log('added');
							},
						},
					},
				},
				search: {
					targets: [
						{
							selector: '#searchspring-layout',
							component: 'Search',
						},
					],
				},
			};
		});

		cy.visit('https://localhost:2222/templates/');

		cy.snapController().then((controller) => {
			const expectedPluginList = [
				'pluginBackgroundFilters', //common
				'pluginScrollToTop', //common
				'pluginLogger', //common
				'pluginAddToCart', //common
			];

			expect(controller.config.plugins.length).to.equal(expectedPluginList.length);

			controller.config.plugins.forEach((plugin, idx) => {
				expect(plugin[0].name).to.equal(expectedPluginList[idx]);
			});
		});
	});

	it('controller specific plugins merge and override global plugins', () => {
		const globalfn = cy.stub().as('globalfn');
		const controllerfn = cy.stub().as('controllerfn');

		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				config: {
					siteId: 'atkzs2',
					language: 'en',
					currency: 'usd',
					platform: 'other',
				},
				plugins: {
					common: {
						addToCart: {
							function: globalfn,
						},
					},
				},
				search: {
					targets: [
						{
							selector: '#searchspring-layout',
							component: 'Search',
						},
					],
					plugins: {
						common: {
							addToCart: {
								function: controllerfn,
							},
						},
					},
				},
			};
		});

		cy.visit('https://localhost:2222/templates/');

		cy.snapController().then(async (controller) => {
			const expectedPluginList = [
				'pluginBackgroundFilters', // common
				'pluginScrollToTop', // common
				'pluginLogger', // common
				'pluginAddToCart', // common
			];

			expect(controller.config.plugins.length).to.equal(expectedPluginList.length);

			controller.config.plugins.forEach((plugin, idx) => {
				expect(plugin[0].name).to.equal(expectedPluginList[idx]);
			});

			await controller.addToCart(controller.store.results[0]);

			cy.get('@controllerfn').should('have.been.called');
			cy.get('@globalfn').should('not.have.been.called');
		});
	});

	it('has shopify plugins registered by default when platform is shopify', () => {
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				config: {
					siteId: 'atkzs2',
					language: 'en',
					currency: 'usd',
					platform: 'shopify',
				},
				search: {
					targets: [
						{
							selector: '#searchspring-layout',
							component: 'Search',
						},
					],
				},
			};
		});

		cy.visit('https://localhost:2222/templates/');

		cy.snapController().then((controller) => {
			const expectedPluginList = [
				'pluginBackgroundFilters', // common
				'pluginScrollToTop', // common
				'pluginLogger', // common
				'pluginShopifyBackgroundFilters',
				'pluginShopifyMutateResults',
				'pluginShopifyAddToCart',
			];
			expect(controller.config.plugins.length).to.equal(expectedPluginList.length);

			controller.config.plugins.forEach((plugin, idx) => {
				expect(plugin[0].name).to.equal(expectedPluginList[idx]);
			});
		});
	});

	it('has bigCommerce plugins registered by default when platform is bigcommerce', () => {
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				config: {
					siteId: 'atkzs2',
					language: 'en',
					currency: 'usd',
					platform: 'bigCommerce',
				},
				search: {
					targets: [
						{
							selector: '#searchspring-layout',
							component: 'Search',
						},
					],
				},
			};
		});

		cy.visit('https://localhost:2222/templates/');

		cy.snapController().then((controller) => {
			const expectedPluginList = [
				'pluginBackgroundFilters', // common
				'pluginScrollToTop', // common
				'pluginLogger', // common
				'pluginBigcommerceBackgroundFilters',
				'pluginBigcommerceAddToCart',
			];
			expect(controller.config.plugins.length).to.equal(expectedPluginList.length);

			controller.config.plugins.forEach((plugin, idx) => {
				expect(plugin[0].name).to.equal(expectedPluginList[idx]);
			});
		});
	});

	it('has magento2 plugins registered by default when platform is magento2', () => {
		cy.on('window:before:load', (win) => {
			win.mergeSnapConfig = {
				config: {
					siteId: 'atkzs2',
					language: 'en',
					currency: 'usd',
					platform: 'magento2',
				},
				search: {
					targets: [
						{
							selector: '#searchspring-layout',
							component: 'Search',
						},
					],
				},
			};
		});

		cy.visit('https://localhost:2222/templates/');

		cy.snapController().then((controller) => {
			const expectedPluginList = [
				'pluginBackgroundFilters', // common
				'pluginScrollToTop', // common
				'pluginLogger', // common
				'pluginMagento2BackgroundFilters',
				'pluginMagento2AddToCart',
			];
			expect(controller.config.plugins.length).to.equal(expectedPluginList.length);

			controller.config.plugins.forEach((plugin, idx) => {
				expect(plugin[0].name).to.equal(expectedPluginList[idx]);
			});
		});
	});
});

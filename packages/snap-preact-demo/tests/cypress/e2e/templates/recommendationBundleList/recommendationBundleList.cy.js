/**
 * End to end tests with Cypress!
 *
 * The purpose of these tests is to prevent publishing of the bundle if a
 * breaking change has been made to the implementation code in the future
 *
 * Start by fill out the config object below. If a selector is not provided,
 * the applicable tests will be skipped.
 *
 */

const config = {
	url: 'https://localhost:2222/templates/bundle.html',
	disableGA: '', // disable google analytic events (example: 'UA-123456-1')
	selectors: {
		recommendation: {
			main: '.ss__recommendation-bundle',
			// selector of the wrapping element. Expects child element to contain <a>
			carousel: `.ss__recommendation-bundle .ss__carousel`,
			result: '.ss__result',
			customResult: '.ss__custom-result',
			seed: '.ss__recommendation-bundle__wrapper__selector--seed',
			nextArrow: '.ss__recommendation-bundle .ss__carousel__next',
			prevArrow: '.ss__recommendation-bundle .ss__carousel__prev',
			activeSlide: '.ss__recommendation-bundle .swiper-slide-active',
			cta: '.ss__recommendation-bundle__wrapper__cta',
			controller: 'recommend_bundle_0',
		},
	},
};

describe('BundledRecommendations', () => {
	describe('Setup', () => {
		it('has valid config', () => {
			cy.wrap(config).its('url').should('have.length.at.least', 1);
			cy.on('window:before:load', (win) => {
				win.mergeSnapConfig = {
					themes: {
						custom: {
							extends: 'bocachica',
							overrides: {
								components: {
									recommendationBundle: {
										lazyRender: {
											enabled: false,
										},
										speed: 0,
									},
								},
							},
						},
					},
					recommendation: {
						bundle: {
							Bundle: {
								component: 'RecommendationBundleList',
								theme: 'custom',
							},
						},
					},
				};
			});
			cy.visit(config.url);
			cy.scrollTo('bottom');
			console.log(Cypress.browser);
		});

		it('snap bundle exists on product page', () => {
			cy.waitForBundle().then((searchspring) => {
				expect(searchspring).to.exist;
			});
		});
	});

	describe('Tests Bundle', () => {
		it('has a controller', function () {
			cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
				expect(store.config.globals.products.length).to.greaterThan(0);
			});
		});

		it('renders recommendations', function () {
			cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
				cy.get(config?.selectors?.recommendation.main).should('exist');

				cy.get(config?.selectors?.recommendation.carousel).should('not.exist');
				cy.get(config?.selectors?.recommendation.result).should('exist');
				cy.get(config?.selectors?.recommendation.seed).should('exist');
			});
		});

		it('renders a seed product', function () {
			cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
				cy.get(config?.selectors?.recommendation.seed).should('exist');
				// cy.get(`${config?.selectors?.recommendation.seed} .ss__recommendation-bundle__wrapper__selector__result-wrapper__seed-badge`)
				// 	.should('exist')
				// 	.should('have.text', 'This Product');
			});
		});

		it('renders cta section', function () {
			cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
				cy.get(config?.selectors?.recommendation.cta).should('exist');

				//title
				cy.get(`${config?.selectors?.recommendation.cta} .cta__inner__subtotal__title`).should('exist').should('have.text', '2 items');
				//price
				cy.get(`${config?.selectors?.recommendation.cta} .cta__inner__price__msrp`).should('exist').contains(`$${store.cart.msrp}`);
				//strike
				cy.get(`${config?.selectors?.recommendation.cta} .cta__inner__price`).should('exist').contains(`$${store.cart.price}`);
				//button
				cy.get(`${config?.selectors?.recommendation.cta} .cta__add-button`).should('exist').should('have.text', 'Add All To Cart');
			});

			//check it is responsive to cartstore changes.
			cy.get(`${config?.selectors?.recommendation.seed} .ss__recommendation-bundle__wrapper__selector__result-wrapper__checkbox`)
				.should('exist')
				.click()
				.then(() => {
					cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
						//title
						cy.get(`${config?.selectors?.recommendation.cta} .cta__inner__subtotal__title`).should('exist').should('have.text', '1 item');
						//price
						cy.get(`${config?.selectors?.recommendation.cta} .cta__inner__price__msrp`).should('exist').contains(`$${store.cart.msrp}`);
						//strike
						cy.get(`${config?.selectors?.recommendation.cta} .cta__inner__price`).should('exist').contains(`$${store.cart.price}`);
						//button
						cy.get(`${config?.selectors?.recommendation.cta} .cta__add-button`).should('exist').should('have.text', 'Add All To Cart');
					});
				});
		});

		it('can click on a result and go to that page', function () {
			cy.document().then((doc) => {
				cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
					cy.get(config?.selectors?.recommendation.result).should('exist');
					let url = doc.querySelector(`${config?.selectors?.recommendation.result} a`).attributes?.href?.value;
					cy.get(`${config?.selectors?.recommendation.result} a`)
						.first()
						.click({ force: true })
						.then(() => {
							cy.location('pathname').should('include', url);
						});
				});
			});
		});

		describe('Tests Custom Result Component', () => {
			it('has valid config', () => {
				cy.wrap(config).its('url').should('have.length.at.least', 1);

				cy.on('window:before:load', (win) => {
					win.mergeSnapConfig = {
						themes: {
							custom: {
								extends: 'bocachica',
								overrides: {
									components: {
										recommendationBundle: {
											lazyRender: {
												enabled: false,
											},
											speed: 0,
										},
									},
								},
							},
						},
						recommendation: {
							bundle: {
								Bundle: {
									component: 'RecommendationBundleList',
									resultComponent: 'CustomResult',
									theme: 'custom',
								},
							},
						},
					};
				});

				cy.visit(config.url);
				cy.scrollTo('bottom');
				console.log(Cypress.browser);
			});

			it('snap bundle exists on product page', () => {
				cy.waitForBundle().then((searchspring) => {
					expect(searchspring).to.exist;
				});
			});

			it('has a controller', function () {
				cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
					expect(store.config.globals.products.length).to.greaterThan(0);
				});
			});

			it('renders recommendations', function () {
				cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
					cy.get(config?.selectors?.recommendation.main).should('exist');

					cy.get(config?.selectors?.recommendation.carousel).should('not.exist');
					cy.get(config?.selectors?.recommendation.customResult).should('exist');
					cy.get(config?.selectors?.recommendation.seed).should('exist');
				});
			});
		});
	});
});

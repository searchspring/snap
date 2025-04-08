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
	url: 'https://localhost:2222/bundle.html', // page containing autocomplete (recommended: home/about/contact page)
	disableGA: '', // disable google analytic events (example: 'UA-123456-1')
	selectors: {
		recommendation: {
			main: '.ss__recommendation-bundle',
			// selector of the wrapping element. Expects child element to contain <a>
			carousel: `.ss__recommendation-bundle .ss__carousel`,
			result: '.ss__result',
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
			cy.visit(config.url);
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

				cy.get(config?.selectors?.recommendation.carousel).should('exist');
				cy.get(config?.selectors?.recommendation.result).should('exist');
				cy.get(config?.selectors?.recommendation.seed).should('exist');
			});
		});

		it('renders a seed product', function () {
			cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
				cy.get(config?.selectors?.recommendation.seed).should('exist');
				cy.get(`${config?.selectors?.recommendation.seed} .ss__recommendation-bundle__wrapper__selector__result-wrapper__seed-badge`)
					.should('exist')
					.should('have.text', 'This Product');
			});
		});

		it('renders cta section', function () {
			cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
				cy.get(config?.selectors?.recommendation.cta).should('exist');

				//title
				cy.get(`${config?.selectors?.recommendation.cta} .ss__recommendation-bundle__wrapper__cta__subtotal__title`)
					.should('exist')
					.should('have.text', 'Subtotal for 4 items');
				//price
				cy.get(`${config?.selectors?.recommendation.cta} .ss__price--strike`).should('exist').contains(`$${store.cart.msrp}`);
				//strike
				cy.get(`${config?.selectors?.recommendation.cta} .ss__recommendation-bundle__wrapper__cta__subtotal__price .ss__price`)
					.should('exist')
					.contains(`$${store.cart.price}`);
				//button
				cy.get(`${config?.selectors?.recommendation.cta} .ss__recommendation-bundle__wrapper__cta__button`)
					.should('exist')
					.should('have.text', 'Add All To Cart');
			});

			//check it is responsive to cartstore changes.
			cy.get(`${config?.selectors?.recommendation.seed} .ss__recommendation-bundle__wrapper__selector__result-wrapper__checkbox`)
				.should('exist')
				.click({ force: true })
				.then(() => {
					cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
						//title
						cy.get(`${config?.selectors?.recommendation.cta} .ss__recommendation-bundle__wrapper__cta__subtotal__title`)
							.should('exist')
							.should('have.text', 'Subtotal for 3 items');
						//price
						cy.get(`${config?.selectors?.recommendation.cta} .ss__price--strike`).should('exist').contains(`$${store.cart.msrp}`);
						//strike
						cy.get(`${config?.selectors?.recommendation.cta} .ss__recommendation-bundle__wrapper__cta__subtotal__price .ss__price`)
							.should('exist')
							.contains(`$${store.cart.price}`);
						//button
						cy.get(`${config?.selectors?.recommendation.cta} .ss__recommendation-bundle__wrapper__cta__button`)
							.should('exist')
							.should('have.text', 'Add All To Cart');
					});
				});
		});

		it('renders carousel next buttons', function () {
			cy.document().then((doc) => {
				cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
					cy.get(config?.selectors?.recommendation.nextArrow).should('exist');
					cy.get(config?.selectors?.recommendation.prevArrow).should('exist');

					cy.get(config?.selectors?.recommendation.activeSlide).should('exist');

					//get the initial active product
					const intialActive = doc.querySelector(
						`${config?.selectors?.recommendation.activeSlide} ${config?.selectors?.recommendation.result} .ss__result__details__title a`
					).innerHTML;
					let newActive;
					//click the next button
					cy.get(config?.selectors?.recommendation.nextArrow)
						.click({ force: true })
						.then(($button) => {
							//get the new active product
							newActive = doc.querySelector(
								`${config?.selectors?.recommendation.activeSlide} ${config?.selectors?.recommendation.result} .ss__result__details__title a`
							).innerHTML;

							//get the new active again

							const newerActiveIndex = doc.querySelector(`${config?.selectors?.recommendation.activeSlide}`).getAttribute('aria-label').split(' ')[0];
							const storeTitle = store.results[parseInt(newerActiveIndex)].mappings.core.name;

							//should have changed
							expect(newActive).to.not.equal(intialActive);
							expect(newActive).to.equal(storeTitle);
						});
				});
			});
		});

		it('renders carousel prev buttons', function () {
			cy.document().then((doc) => {
				cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
					cy.get(config?.selectors?.recommendation.nextArrow).should('exist');
					cy.get(config?.selectors?.recommendation.prevArrow).should('exist');

					cy.get(config?.selectors?.recommendation.activeSlide).should('exist');

					//get the initial active product
					const intialActive = doc.querySelector(
						`${config?.selectors?.recommendation.activeSlide} ${config?.selectors?.recommendation.result} .ss__result__details__title a`
					).innerHTML;

					//click the prev button
					cy.get(config?.selectors?.recommendation.prevArrow)
						.click({ force: true })
						.then(($button) => {
							const newerActiveTitle = doc.querySelector(
								`${config?.selectors?.recommendation.activeSlide} ${config?.selectors?.recommendation.result} .ss__result__details__title a`
							).innerHTML;

							//these should not match
							expect(newerActiveTitle).to.not.equal(intialActive);
						});
				});
			});
		});

		it('can click on a result and go to that page', function () {
			cy.document().then((doc) => {
				cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
					cy.get(config?.selectors?.recommendation.activeSlide).should('exist');
					let url = doc.querySelector(`${config?.selectors?.recommendation.activeSlide} ${config?.selectors?.recommendation.result} a`).attributes
						?.href?.value;
					cy.get(`${config?.selectors?.recommendation.activeSlide} a`)
						.first()
						.click({ force: true })
						.then(() => {
							cy.location('pathname').should('include', url);
						});
				});
			});
		});
	});
});

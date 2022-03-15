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
	url: 'https://localhost:2222/product.html', // page containing autocomplete (recommended: home/about/contact page)
	disableGA: '', // disable google analytic events (example: 'UA-123456-1')
	selectors: {
		recommendation: {
			main: '.ss__recommendation',
			// selector of the wrapping element. Expects child element to contain <a>
			carousel: `.ss__recommendation .ss__carousel`,
			result: '.ss__result',
			nextArrow: '.ss__recommendation .ss__carousel__next',
			prevArrow: '.ss__recommendation .ss__carousel__prev',
			activeSlide: '.ss__recommendation .swiper-slide-active',
			controller: 'recommend_similar0',
		},
	},
};

describe('Recommendations', () => {
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

	describe('Tests Recommendations', () => {
		it('has a controller', function () {
			cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
				expect(store.config.globals.limits).equals(store.results.length);
				expect(store.config.globals.product.length).to.greaterThan(0);
			});
		});

		it('renders recommendations', function () {
			cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
				cy.get(config?.selectors?.recommendation.main).should('exist');

				cy.get(config?.selectors?.recommendation.carousel).should('exist');
				cy.get(config?.selectors?.recommendation.result).should('exist');
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
						.click()
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

		it.skip('renders carousel next buttons', function () {
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
						.click()
						.then(($button) => {
							//get the new active product
							newActive = doc.querySelector(
								`${config?.selectors?.recommendation.activeSlide} ${config?.selectors?.recommendation.result} .ss__result__details__title a`
							).innerHTML;

							//get the new active again

							const newerActiveIndex = doc.querySelector(`${config?.selectors?.recommendation.activeSlide}`).getAttribute('data-swiper-slide-index');
							const storeTitle = store.results[parseInt(newerActiveIndex)].mappings.core.name;

							//should have changed
							expect(newActive).to.not.equal(intialActive);
							expect(newActive).to.equal(storeTitle);
						});
				});
			});
		});

		it('can click on a result and go to that page', function () {
			cy.document().then((doc) => {
				cy.get(config?.selectors?.recommendation.activeSlide).should('exist');
				let url = doc.querySelector(`${config?.selectors?.recommendation.activeSlide} ${config?.selectors?.recommendation.result} a`).attributes?.href
					?.value;
				cy.get(config?.selectors?.recommendation.activeSlide)
					.click({ multiple: true })
					.then(() => {
						cy.location('pathname').should('include', url);
					});
			});
		});
	});
});

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
	url: 'https://localhost:2222/snap/bundle.html', // page containing autocomplete (recommended: home/about/contact page)
	disableGA: '', // disable google analytic events (example: 'UA-123456-1')
	selectors: {
		recommendation: {
			main: '.ss__bundled-recommendations',
			// selector of the wrapping element. Expects child element to contain <a>
			carousel: `.ss__bundled-recommendations .ss__carousel`,
			result: '.ss__result',
			seed: '.ss__bundled-recommendations__wrapper__selector--seed',
			nextArrow: '.ss__bundled-recommendations .ss__carousel__next',
			prevArrow: '.ss__bundled-recommendations .ss__carousel__prev',
			activeSlide: '.ss__bundled-recommendations .swiper-slide-active',
			cta: '.ss__bundled-recommendations__wrapper__cta',
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
				expect(store.config.globals.product.length).to.greaterThan(0);
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
				cy.get(`${config?.selectors?.recommendation.seed} .ss__bundled-recommendations__wrapper__selector__result-wrapper__seed-badge`)
					.should('exist')
					.should('have.text', 'This Product');
			});
		});

		it('renders cta section', function () {
			cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
				cy.get(config?.selectors?.recommendation.cta).should('exist');

				//title
				cy.get(`${config?.selectors?.recommendation.cta} .cta__title`).should('exist').should('have.text', '3 items added');
				//price
				cy.get(`${config?.selectors?.recommendation.cta} .strike`).should('exist').should('have.text', '$200.00');
				//strike
				cy.get(`${config?.selectors?.recommendation.cta} .sale.price`).should('exist').should('have.text', '$165.00');
				//button
				cy.get(`${config?.selectors?.recommendation.cta} .ss__button`).should('exist').should('have.text', 'Add All 3 To Cart');

				expect(store.cart.count).to.equal(3);
				expect(store.cart.price).to.equal(165);
				expect(store.cart.msrp).to.equal(200);
			});

			//check it is responsive to cartstore changes.
			cy.get(`${config?.selectors?.recommendation.seed} .ss__bundled-recommendations__wrapper__selector__result-wrapper__checkbox`)
				.should('exist')
				.click()
				.then(() => {
					//title
					cy.get(`${config?.selectors?.recommendation.cta} .cta__title`).should('exist').should('have.text', '2 items added');
					//price
					cy.get(`${config?.selectors?.recommendation.cta} .strike`).should('exist').should('have.text', '$150.00');
					//strike
					cy.get(`${config?.selectors?.recommendation.cta} .sale.price`).should('exist').should('have.text', '$117.00');
					//button
					cy.get(`${config?.selectors?.recommendation.cta} .ss__button`).should('exist').should('have.text', 'Add All 2 To Cart');

					cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
						expect(store.cart.count).to.equal(2);
						expect(store.cart.price).to.equal(117);
						expect(store.cart.msrp).to.equal(150);
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
						.click()
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

		it('can click on a result and go to that page', function () {
			cy.document().then((doc) => {
				cy.snapController(config?.selectors?.recommendation.controller).then(({ store }) => {
					cy.get(config?.selectors?.recommendation.activeSlide).should('exist');
					let url = doc.querySelector(`${config?.selectors?.recommendation.activeSlide} ${config?.selectors?.recommendation.result} a`).attributes
						?.href?.value;
					cy.get(config?.selectors?.recommendation.activeSlide)
						.click({ multiple: true })
						.then(() => {
							cy.location('pathname').should('include', url);
						});
				});
			});
		});
	});
});

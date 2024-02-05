import 'whatwg-fetch';
import { h } from 'preact';
import { RecommendationStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Client } from '@searchspring/snap-client';
import { RecommendationController } from '@searchspring/snap-controller';
import { BundledRecommendation } from '../../../../src/components/Organisms/BundledRecommendation';
import { mount } from '@cypress/react';
import { ThemeProvider } from '../../../../src/providers';
import { Result } from '../../../../src/components/Molecules/Result';

const globals = { siteId: '8uyt2m' };

const recommendConfig = {
	id: 'search',
	tag: 'trending',
};

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = {
	urlManager,
};

const theme = {
	components: {
		bundledRecommendation: {
			prevButton: 'Global Theme Prev',
			nextButton: 'Global Theme Next',
		},
	},
};

const client = new Client(globals, {});

const controller = new RecommendationController(recommendConfig, {
	client: client,
	store: new RecommendationStore(recommendConfig, services),
	urlManager,
	eventManager: new EventManager(),
	profiler: new Profiler(),
	logger: new Logger(),
	tracker: new Tracker(globals, { mode: 'development' }),
});

describe('BundledRecommendation Component', async () => {
	before(async () => {
		await controller.search();
	});

	it('renders with controller', () => {
		mount(<BundledRecommendation controller={controller} onAddToCart={cy.stub().as('onAddToCart')} />);
		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__carousel__prev').should('exist');
		cy.get('.ss__carousel__next').should('exist');
		cy.get('.ss__bundled-recommendations .ss__result').should('have.length', 20);
		cy.get('.ss__bundled-recommendations__wrapper__seed').should('exist');
	});

	it('renders with results', () => {
		const results = controller.store.results.reverse();
		mount(<BundledRecommendation controller={controller} results={results} onAddToCart={cy.stub().as('onAddToCart')} />);
		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__carousel__prev').should('exist');
		cy.get('.ss__carousel__next').should('exist');
		cy.get('.ss__bundled-recommendations .ss__result').should('have.length', 20);
		cy.get('.ss__bundled-recommendations__wrapper__seed').should('exist');
		cy.get('.ss__bundled-recommendations .ss__result:first .ss__result__details__title a').should('have.text', results[0].mappings.core?.name);
	});

	it('can use onAddToCart prop', () => {
		mount(<BundledRecommendation controller={controller} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('@onAddToCart').should('not.be.called');

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations__wrapper__cta').should('exist');
		cy.get('.ss__bundled-recommendations__wrapper__cta__subtotal__title').should('exist').should('have.text', 'Subtotal for 4 items');
		cy.get('.ss__bundled-recommendations__wrapper__cta__button')
			.should('exist')
			.click()
			.then(() => {
				cy.get('@onAddToCart').should('be.calledWith', [
					controller.store.results[0],
					controller.store.results[1],
					controller.store.results[2],
					controller.store.results[3],
				]);
			});
	});

	it('can use addToCartButtonText prop', () => {
		const text = 'some custom button';
		mount(<BundledRecommendation controller={controller} addToCartButtonText={text} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('@onAddToCart').should('not.be.called');

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations__wrapper__cta').should('exist');
		cy.get('.ss__bundled-recommendations__wrapper__cta__button')
			.should('exist')
			.should('have.text', text)
			.click()
			.then(() => {
				cy.get('@onAddToCart').should('be.calledWith', [
					controller.store.results[0],
					controller.store.results[1],
					controller.store.results[2],
					controller.store.results[3],
				]);
			});
	});

	it('can use title prop', () => {
		const title = 'some custom title';
		mount(<BundledRecommendation controller={controller} title={title} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations__title').should('exist').should('have.text', title);
	});

	it('can use hideButtons prop', () => {
		mount(<BundledRecommendation controller={controller} hideButtons={true} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__carousel__prev-wrapper').should('exist').should('have.class', 'ss__carousel__prev-wrapper--hidden');
		cy.get('.ss__carousel__next-wrapper').should('exist').should('have.class', 'ss__carousel__next-wrapper--hidden');
	});

	it('can enable pagination dots', () => {
		mount(<BundledRecommendation controller={controller} pagination={true} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.swiper-pagination-bullets').should('exist');
	});

	it('can use custom resultComponent', () => {
		const ResultSlot = (props: any) => {
			return (
				<div className="findMe">
					<div
						className={`ss__bundle-selector ${props.seed ? 'ss__bundle-selector--seed' : ''} ${
							props.selected ? 'ss__bundle-selector--selected' : ''
						}`}
					>
						<div style={props.seed ? { border: '1px solid gray' } : {}} className="ss__bundle-selector__result-wrapper">
							<Result result={props.result} />
						</div>
					</div>
				</div>
			);
		};

		mount(<BundledRecommendation controller={controller} resultComponent={<ResultSlot />} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations .findMe .ss__result').should('have.length', 20);
		cy.get('.ss__bundled-recommendations .findMe .ss__result .ss__result__details__title a').should('satisfy', ($el) => {
			return Array.from($el).map((titleElem: any, idx) => {
				return titleElem.innerHTML == controller.store.results[idx].mappings.core?.name;
			});
		});
	});

	it('can use custom ctaSlot', () => {
		const CtaSlot = (props: any) => {
			return (
				<div className="findMe">
					<div className="selectedItems">{props.selectedItems.length}</div>
					<div className="bundlePrice">{props.bundlePrice}</div>
					<div className="strikePrice">{props.bundleStrikePrice}</div>

					<div className="ctaButton" onClick={() => props.onAddToCartClick()}>
						custom button here
					</div>
				</div>
			);
		};

		mount(<BundledRecommendation controller={controller} ctaSlot={<CtaSlot />} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations .findMe').should('exist');

		cy.get('.ss__bundled-recommendations .findMe .bundlePrice').should('exist').should('have.text', '241');
		cy.get('.ss__bundled-recommendations .findMe .strikePrice').should('exist').should('have.text', '275');
		cy.get('.ss__bundled-recommendations .findMe .selectedItems').should('exist').should('have.text', '4');

		cy.get('.ctaButton')
			.should('exist')
			.click()
			.then(() => {
				cy.get('@onAddToCart').should('be.calledWith', [
					controller.store.results[0],
					controller.store.results[1],
					controller.store.results[2],
					controller.store.results[3],
				]);
			});
	});

	it('can use set preselectedCount', () => {
		const count = 7;
		mount(<BundledRecommendation controller={controller} preselectedCount={count} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations .ss__bundled-recommendations__wrapper__selector--selected').should('have.length', 7);
	});

	it('can hide checkboxes with showCheckboxes', () => {
		mount(<BundledRecommendation controller={controller} showCheckboxes={false} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations .ss__bundled-recommendations__wrapper__selector__result-wrapper__checkbox').should('not.exist');

		mount(<BundledRecommendation controller={controller} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations .ss__bundled-recommendations__wrapper__selector__result-wrapper__checkbox').should('exist');

		cy.get('.ss__bundled-recommendations__wrapper__cta__subtotal__title').should('have.text', 'Subtotal for 4 items');

		cy.get('.ss__bundled-recommendations .ss__bundled-recommendations__wrapper__selector__result-wrapper__checkbox')
			.should('exist')
			.first()
			.click()
			.then(() => {
				cy.get('.ss__bundled-recommendations__wrapper__cta__subtotal__title').should('have.text', 'Subtotal for 3 items');
			});
	});

	it('can put the seed in the carousel', () => {
		mount(<BundledRecommendation controller={controller} seedInCarousel={true} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get(
			'.ss__bundled-recommendations .ss__bundled-recommendations__wrapper--seed-in-carousel .ss__bundled-recommendations__wrapper__carousel .ss__bundled-recommendations__wrapper__seed'
		).should('exist');

		mount(<BundledRecommendation controller={controller} seedInCarousel={false} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations .ss__bundled-recommendations__wrapper__seed').should('exist');
		cy.get('.ss__bundled-recommendations .ss__bundled-recommendations__wrapper__carousel .ss__bundled-recommendations__wrapper__seed').should(
			'not.exist'
		);
		cy.get(
			'.ss__bundled-recommendations .ss__bundled-recommendations__wrapper--seed-in-carousel .ss__bundled-recommendations__wrapper__carousel .ss__bundled-recommendations__wrapper__seed'
		).should('not.exist');
	});

	it('can set the seed badge text', () => {
		const seedText = 'this is the seed';

		mount(<BundledRecommendation controller={controller} seedText={seedText} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get(
			'.ss__bundled-recommendations .ss__bundled-recommendations__wrapper__seed .ss__bundled-recommendations__wrapper__selector__result-wrapper__seed-badge'
		)
			.should('exist')
			.should('have.text', seedText);
	});

	it('can set seed icon only', () => {
		// can set seed icon only with seed not in carousel
		mount(<BundledRecommendation controller={controller} seedSeparatorIconOnly={true} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations__wrapper__selector__icon').should('have.length', 1);
		cy.get('.ss__bundled-recommendations .ss__bundled-recommendations__wrapper__seed .ss__bundled-recommendations__wrapper__selector__icon').should(
			'exist'
		);

		// can set seed icon only with seed in carousel
		mount(
			<BundledRecommendation controller={controller} seedInCarousel={true} seedSeparatorIconOnly={true} onAddToCart={cy.stub().as('onAddToCart')} />
		);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations__wrapper__selector__icon').should('have.length', 1);
		cy.get('.ss__bundled-recommendations .ss__bundled-recommendations__wrapper__seed .ss__bundled-recommendations__wrapper__selector__icon').should(
			'exist'
		);

		//can set seed icon only false with seed not in carousel
		mount(<BundledRecommendation controller={controller} seedSeparatorIconOnly={false} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations__wrapper__selector__icon').should('have.length', 20);

		//can set seed icon only false with seed in carousel
		mount(
			<BundledRecommendation controller={controller} seedInCarousel={true} seedSeparatorIconOnly={false} onAddToCart={cy.stub().as('onAddToCart')} />
		);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations__wrapper__selector__icon').should('have.length', 20);
	});

	it('can set custom seperator icons', () => {
		mount(
			<BundledRecommendation controller={controller} seperatorIcon={'cog'} seedSeparatorIconOnly={false} onAddToCart={cy.stub().as('onAddToCart')} />
		);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations__wrapper__selector__icon.ss__icon--cog').should('have.length', 20);
	});

	it('can use set showQuantityPicker and adjust quantity', () => {
		mount(<BundledRecommendation controller={controller} showQuantityPicker={true} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations .ss__bundled-recommendations__wrapper__selector__qty')
			.should('exist')
			.first()
			.type('3')
			.then(() => {
				expect(controller.store.results[0].quantity).to.equal(13);
				cy.get('.ss__bundled-recommendations__wrapper__cta__subtotal__title').should('have.text', 'Subtotal for 16 items');
			});
	});

	it('can use set quantityPickerText', () => {
		const text = 'some text';
		mount(
			<BundledRecommendation controller={controller} showQuantityPicker={true} quantityPickerText={text} onAddToCart={cy.stub().as('onAddToCart')} />
		);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations .ss__bundled-recommendations__wrapper__selector__qty').should('satisfy', ($el) => {
			return Array.from($el).map((elem: any) => {
				return elem.innerHTML == text;
			});
		});
	});

	it('can set stackedCTA prop', () => {
		mount(<BundledRecommendation controller={controller} stackedCTA={false} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations .ss__bundled-recommendations__wrapper .ss__bundled-recommendations__wrapper__cta').should('exist');

		mount(<BundledRecommendation controller={controller} stackedCTA={true} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations .ss__bundled-recommendations__wrapper .ss__bundled-recommendations__wrapper__cta').should('not.exist');
		cy.get('.ss__bundled-recommendations .ss__bundled-recommendations__wrapper__cta').should('exist');
	});

	it('can set CTAicon', () => {
		//has default icon
		mount(<BundledRecommendation controller={controller} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get(
			'.ss__bundled-recommendations .ss__bundled-recommendations__wrapper .ss__bundled-recommendations__wrapper__cta .ss__bundled-recommendations__wrapper__cta__icon'
		).should('exist');

		mount(<BundledRecommendation controller={controller} ctaIcon={'cog'} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get(
			'.ss__bundled-recommendations .ss__bundled-recommendations__wrapper .ss__bundled-recommendations__wrapper__cta .ss__bundled-recommendations__wrapper__cta__icon'
		)
			.should('exist')
			.should('have.class', 'ss__icon--cog');

		mount(<BundledRecommendation controller={controller} ctaIcon={false} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get(
			'.ss__bundled-recommendations .ss__bundled-recommendations__wrapper .ss__bundled-recommendations__wrapper__cta .ss__bundled-recommendations__wrapper__cta__icon'
		).should('not.exist');
	});

	it('can set peekaboo prop', () => {
		mount(<BundledRecommendation controller={controller} peekaboo={true} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.swiper-slide-visible').should('have.length', 4);

		mount(<BundledRecommendation controller={controller} peekaboo={false} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.swiper-slide-visible').should('have.length', 3);
	});

	it('can disable styling', () => {
		mount(<BundledRecommendation controller={controller} onAddToCart={cy.stub().as('onAddToCart')} disableStyles />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations').should('satisfy', ($el) => {
			const classList = Array.from($el[0].classList);
			return classList.length == 1;
		});
	});

	it('renders with classname', () => {
		const className = 'classy';

		mount(<BundledRecommendation controller={controller} onAddToCart={cy.stub().as('onAddToCart')} className={className} />);

		cy.get('.ss__bundled-recommendations').should('exist');
		cy.get('.ss__bundled-recommendations').should('have.class', className);
	});

	it('is themeable with ThemeProvider', () => {
		mount(
			<ThemeProvider theme={theme}>
				<BundledRecommendation controller={controller} onAddToCart={cy.stub().as('onAddToCart')} />
			</ThemeProvider>
		);

		cy.get('.ss__bundled-recommendations').should('exist');

		const prev = cy.get('.ss__carousel__prev');
		prev.should('exist');
		prev.should('have.text', theme.components.bundledRecommendation.prevButton);

		const next = cy.get('.ss__carousel__next');
		next.should('exist');
		next.should('have.text', theme.components.bundledRecommendation.nextButton);
	});

	it('is themeable with theme prop', () => {
		mount(<BundledRecommendation theme={theme} controller={controller} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__bundled-recommendations').should('exist');

		const prev = cy.get('.ss__carousel__prev');
		prev.should('exist');
		prev.should('have.text', theme.components.bundledRecommendation.prevButton);

		const next = cy.get('.ss__carousel__next');
		next.should('exist');
		next.should('have.text', theme.components.bundledRecommendation.nextButton);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const themeOverride = {
			components: {
				bundledRecommendation: {
					prevButton: 'Prev Button Yo',
					nextButton: 'Next Button Yo',
				},
			},
		};

		mount(
			<ThemeProvider theme={theme}>
				<BundledRecommendation controller={controller} theme={themeOverride} onAddToCart={cy.stub().as('onAddToCart')} />
			</ThemeProvider>
		);

		cy.get('.ss__bundled-recommendations').should('exist');

		const prev = cy.get('.ss__carousel__prev');
		prev.should('exist');
		prev.should('have.text', themeOverride.components.bundledRecommendation.prevButton);
		prev.should('not.have.text', theme.components.bundledRecommendation.prevButton);

		const next = cy.get('.ss__carousel__next');
		next.should('exist');
		next.should('have.text', themeOverride.components.bundledRecommendation.nextButton);
		next.should('not.have.text', theme.components.bundledRecommendation.nextButton);
	});

	it('breakpoints override theme prop', () => {
		// Change the viewport to 1200px.
		cy.viewport(1200, 750);

		const ThemeDetailSlot = () => {
			return <div className="theme-detail-slot">theme details...</div>;
		};

		const BreakPointDetailSlot = () => {
			return <div className="breakpoint-detail-slot">breakpoint details...</div>;
		};

		const componentTheme = {
			components: {
				result: {
					detailSlot: [<ThemeDetailSlot />],
				},
			},
		};

		const customBreakpoints = {
			0: {},
			700: {
				theme: {
					components: {
						result: {
							detailSlot: [<BreakPointDetailSlot />],
						},
					},
				},
			},
		};

		mount(
			<BundledRecommendation
				controller={controller}
				breakpoints={customBreakpoints}
				theme={componentTheme}
				onAddToCart={cy.stub().as('onAddToCart')}
			/>
		);

		cy.get('.theme-detail-slot').should('have.length', 0);
		cy.get('.breakpoint-detail-slot').should('have.length', 20);

		// Change the viewport to 500px.
		cy.viewport(500, 750);

		cy.get('.theme-detail-slot').should('have.length', 20);
		cy.get('.breakpoint-detail-slot').should('have.length', 0);

		// reset the viewport to 1200px.
		cy.viewport(1200, 750);
	});
});

import { Fragment, h } from 'preact';
import { RecommendationStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Client } from '@searchspring/snap-client';
import { RecommendationController } from '@searchspring/snap-controller';
import { RecommendationBundle } from '../../../../src/components/Templates/RecommendationBundle';
import { mount } from '@cypress/react';
import { ThemeProvider } from '../../../../src/providers';
import { Result } from '../../../../src/components/Molecules/Result';
import json from '../../fixtures/results-bundle.json';
import profile from '../../fixtures/profile-bundle.json';
import { observer } from 'mobx-react-lite';

const globals = { siteId: '8uyt2m' };

const recommendConfig = {
	id: 'search',
	tag: 'bundle',
	globals: {
		products: ['C-AD-W1-1869P'],
	},
	settings: {
		variants: {
			field: 'ss_variants',
		},
	},
};

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = {
	urlManager,
};

const theme = {
	components: {
		recommendationBundle: {
			carousel: {
				prevButton: 'Global Theme Prev',
				nextButton: 'Global Theme Next',
			},
		},
	},
};

const client = new Client(globals, {});

let controller;

describe('RecommendationBundle Component', async () => {
	before(() => {
		cy.intercept('*recommend*', json);
		cy.intercept('*profile*', profile);
	});

	beforeEach(async () => {
		controller = new RecommendationController(recommendConfig, {
			client: client,
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals, { mode: 'development' }),
		});
		await controller.search();
	});

	it('renders with controller', () => {
		mount(<RecommendationBundle controller={controller} onAddToCart={cy.stub().as('onAddToCart')} />);
		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__carousel__prev').should('exist');
		cy.get('.ss__carousel__next').should('exist');
		cy.get('.ss__recommendation-bundle .ss__result').should('have.length', 5);
		cy.get('.ss__recommendation-bundle__wrapper__selector--seed').should('exist');
	});

	it('renders with results', () => {
		const results = controller.store.results.reverse();
		mount(<RecommendationBundle controller={controller} results={results} onAddToCart={cy.stub().as('onAddToCart')} />);
		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__carousel__prev').should('exist');
		cy.get('.ss__carousel__next').should('exist');
		cy.get('.ss__recommendation-bundle .ss__result').should('have.length', 5);
		cy.get('.ss__recommendation-bundle__wrapper__selector--seed').should('exist');
		cy.get('.ss__recommendation-bundle .ss__result:first .ss__result__details__title a').should('have.text', results[0].mappings.core?.name);
	});

	it('can use onAddToCart prop', () => {
		mount(<RecommendationBundle controller={controller} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('@onAddToCart').should('not.be.called');

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle__wrapper__cta').should('exist');
		cy.get('.ss__recommendation-bundle__wrapper__cta__subtotal__title').should('exist').should('have.text', 'Subtotal for 4 items');
		cy.get('.ss__recommendation-bundle__wrapper__cta__button')
			.should('exist')
			.click()
			.then(() => {
				cy.get('@onAddToCart').should('be.calledWith', Cypress.sinon.match.any, [
					controller.store.results[0],
					controller.store.results[1],
					controller.store.results[2],
					controller.store.results[3],
				]);
			});
	});

	it('can use ctaButtonText prop', () => {
		const text = 'some custom button';
		mount(<RecommendationBundle controller={controller} ctaButtonText={text} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('@onAddToCart').should('not.be.called');

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle__wrapper__cta').should('exist');
		cy.get('.ss__recommendation-bundle__wrapper__cta__button')
			.should('exist')
			.should('have.text', text)
			.click()
			.then(() => {
				cy.get('@onAddToCart').should('be.calledWith', Cypress.sinon.match.any, [
					controller.store.results[0],
					controller.store.results[1],
					controller.store.results[2],
					controller.store.results[3],
				]);
			});
	});

	it('can use title prop', () => {
		const title = 'some custom title';
		mount(<RecommendationBundle controller={controller} title={title} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle__title').should('exist').should('have.text', title);
	});

	it('can use vertical prop', () => {
		mount(<RecommendationBundle controller={controller} vertical={true} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle__wrapper--vertical').should('exist');

		mount(<RecommendationBundle controller={controller} vertical={false} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle__wrapper--vertical').should('not.exist');
	});

	it('can use hideButtons prop', () => {
		mount(<RecommendationBundle controller={controller} hideButtons={true} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__carousel__prev-wrapper').should('exist').should('have.class', 'ss__carousel__prev-wrapper--hidden');
		cy.get('.ss__carousel__next-wrapper').should('exist').should('have.class', 'ss__carousel__next-wrapper--hidden');
	});

	it('can enable pagination dots', () => {
		mount(<RecommendationBundle controller={controller} pagination={true} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
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

		mount(<RecommendationBundle controller={controller} resultComponent={<ResultSlot />} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle .findMe .ss__result').should('have.length', 5);
		cy.get('.ss__recommendation-bundle .findMe .ss__result .ss__result__details__title a').should('satisfy', ($el) => {
			return Array.from($el).map((titleElem: any, idx) => {
				return titleElem.innerHTML == controller.store.results[idx].mappings.core?.name;
			});
		});
	});

	it('can use custom ctaSlot', async () => {
		const CtaSlot = observer((props: any) => {
			return (
				<div className="findMe">
					<div className="selectedItems">{props.cartStore.items.length}</div>
					<div className="bundlePrice">{props.cartStore.price}</div>
					<div className="strikePrice">{props.cartStore.msrp}</div>

					<div className="ctaButton" onClick={() => props.onAddToCartClick()}>
						custom button here
					</div>
				</div>
			);
		});

		const ResultSlot = observer(({ result }: any) => {
			const { selections } = result.variants;

			return (
				<div className="standardSelections">
					{selections.map((selection: any) => {
						return (
							<div>
								<div className="collapsible-content__inner ss__facet-options">
									<StandardSelection selection={selection} result={result} />
								</div>
							</div>
						);
					})}
				</div>
			);
		});

		const ResultComponent = observer((props: any) => {
			return <Result result={props.result} detailSlot={<ResultSlot result={props.result} />} className={props.result.mappings.core?.sku} />;
		});

		const StandardSelection = observer((props: any) => {
			const { selection } = props;
			return selection.values.length ? (
				<div className="ss__standardSelection">
					<div>
						{selection.values.map((val: any) => {
							const selected = selection.selected == val.value;
							return (
								<div
									className={`
											selection-value 
											${selected ? 'selected' : ''} 
											${val.available ? '' : 'unavailable'}
										`}
									onClick={() => selection.select(val.value)}
								>
									{val.label}
								</div>
							);
						})}
					</div>
				</div>
			) : (
				<Fragment></Fragment>
			);
		});

		mount(
			<RecommendationBundle
				controller={controller}
				ctaSlot={<CtaSlot />}
				resultComponent={<ResultComponent />}
				onAddToCart={cy.stub().as('onAddToCart')}
			/>
		);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle .findMe').should('exist');

		cy.get('.ss__recommendation-bundle .findMe .bundlePrice').should('exist').should('have.text', '306.98');
		cy.get('.ss__recommendation-bundle .findMe .strikePrice').should('exist').should('have.text', '311.98');
		cy.get('.ss__recommendation-bundle .findMe .selectedItems').should('exist').should('have.text', '4');

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

		//lets change the color and make sure the cta updates with that new variant data
		cy.get('.ss__result.1610037-FDK-XX-28 .selection-value')
			.contains('Mirage')
			.last()
			.should('exist')
			.click({ force: true })
			.then(() => {
				cy.get('.ss__recommendation-bundle .findMe .bundlePrice').should('exist').should('have.text', '318.98');
				cy.get('.ss__recommendation-bundle .findMe .strikePrice').should('exist').should('have.text', '323.98');
				cy.get('.ss__recommendation-bundle .findMe .selectedItems').should('exist').should('have.text', '4');
			});

		//lets remove this product from the bundle and see the cta values update
		cy.get('.swiper-last-visible-slide .ss__recommendation-bundle__wrapper__selector__result-wrapper__checkbox')
			.click({ force: true })
			.then(() => {
				cy.get('.ss__recommendation-bundle .findMe .strikePrice').should('exist').should('have.text', '272.99');
				cy.get('.ss__recommendation-bundle .findMe .selectedItems').should('exist').should('have.text', '3');
				cy.get('.ss__recommendation-bundle .findMe .bundlePrice').should('exist').should('have.text', '267.99');
			});
	});

	// it('can use set preselectedCount', () => {
	// 	const count = 2;
	// 	mount(<RecommendationBundle controller={controller} preselectedCount={count} onAddToCart={cy.stub().as('onAddToCart')} />);

	// 	cy.get('.ss__recommendation-bundle').should('exist');
	// 	// cy.get('.ss__recommendation-bundle .ss__recommendation-bundle__wrapper__selector--selected').should("exist");
	// 	cy.get('.ss__recommendation-bundle .ss__recommendation-bundle__wrapper__selector--selected').its('length').should('eq', 4);
	// });

	it('can hide checkboxes with hideCheckboxes', () => {
		mount(<RecommendationBundle controller={controller} hideCheckboxes={true} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle .ss__recommendation-bundle__wrapper__selector__result-wrapper__checkbox').should('not.exist');
	});

	it('renders checkboxes by default', () => {
		mount(<RecommendationBundle controller={controller} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle .ss__recommendation-bundle__wrapper__selector__result-wrapper__checkbox').should('exist');

		cy.get('.ss__recommendation-bundle__wrapper__cta__subtotal__title').should('have.text', 'Subtotal for 4 items');

		cy.get('.ss__recommendation-bundle .ss__recommendation-bundle__wrapper__selector__result-wrapper__checkbox')
			.should('exist')
			.first()
			.click()
			.then(() => {
				cy.get('.ss__recommendation-bundle__wrapper__cta__subtotal__title').should('have.text', 'Subtotal for 3 items');
			});
	});

	it('can hide the seed with hideSeed when seed is both in/out of the carousel', () => {
		const carouselProps = {
			seedInCarousel: true,
		};
		mount(<RecommendationBundle controller={controller} hideSeed={true} carousel={carouselProps} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle .ss__recommendation-bundle__wrapper__selector--seed').should('not.exist');

		const carouselProps2 = {
			seedInCarousel: false,
		};
		mount(<RecommendationBundle controller={controller} hideSeed={true} carousel={carouselProps2} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle .ss__recommendation-bundle__wrapper__selector--seed').should('not.exist');
	});

	it('can render with carousel disabled', () => {
		const carouselProps = {
			enabled: false,
		};
		mount(<RecommendationBundle controller={controller} carousel={carouselProps} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle__wrapper').should('exist');
		cy.get('.ss__recommendation-bundle__wrapper__selector').should('have.length', 5);
	});

	it('can hide the seed with hideSeed when carousel is disabled', () => {
		const carouselProps = {
			enabled: false,
		};
		mount(<RecommendationBundle controller={controller} hideSeed={true} carousel={carouselProps} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle .ss__recommendation-bundle__wrapper__selector--seed').should('not.exist');

		cy.get('.ss__recommendation-bundle__wrapper').should('exist');
		cy.get('.ss__recommendation-bundle__wrapper__selector').should('have.length', controller.store.results.length - 1);
		cy.get('.ss__recommendation-bundle__wrapper__selector').should('have.length', 4);
	});

	it('can put the seed in the carousel', () => {
		const carouselProps = {
			seedInCarousel: true,
		};
		mount(<RecommendationBundle controller={controller} carousel={carouselProps} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get(
			'.ss__recommendation-bundle .ss__recommendation-bundle__wrapper--seed-in-carousel .ss__recommendation-bundle__wrapper__carousel .ss__recommendation-bundle__wrapper__selector--seed'
		).should('exist');

		const carouselProps2 = {
			seedInCarousel: false,
		};
		mount(<RecommendationBundle controller={controller} carousel={carouselProps2} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle .ss__recommendation-bundle__wrapper__selector--seed').should('exist');
		cy.get('.ss__recommendation-bundle .ss__recommendation-bundle__wrapper__carousel .ss__recommendation-bundle__wrapper__selector--seed').should(
			'not.exist'
		);
		cy.get(
			'.ss__recommendation-bundle .ss__recommendation-bundle__wrapper--seed-in-carousel .ss__recommendation-bundle__wrapper__carousel .ss__recommendation-bundle__wrapper__selector--seed'
		).should('not.exist');
	});

	it('can set the seed badge text', () => {
		const seedText = 'this is the seed';

		mount(<RecommendationBundle controller={controller} seedText={seedText} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get(
			'.ss__recommendation-bundle .ss__recommendation-bundle__wrapper__selector--seed .ss__recommendation-bundle__wrapper__selector__result-wrapper__seed-badge'
		)
			.should('exist')
			.should('have.text', seedText);
	});

	it('can hide the seed badge text', () => {
		const seedText = 'this is the seed';
		const lang = {
			seedText: {
				value: 'langy seed text',
			},
		};

		mount(
			<RecommendationBundle hideSeedText={true} lang={lang} controller={controller} seedText={seedText} onAddToCart={cy.stub().as('onAddToCart')} />
		);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get(
			'.ss__recommendation-bundle .ss__recommendation-bundle__wrapper__selector--seed .ss__recommendation-bundle__wrapper__selector__result-wrapper__seed-badge'
		)
			.should('exist')
			.should('not.have.text', seedText)
			.should('not.have.text', lang.seedText.value);
	});

	it('can set seed icon only', () => {
		// can set seed icon only with seed not in carousel
		mount(<RecommendationBundle controller={controller} separatorIconSeedOnly={true} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle__wrapper__selector__icon').should('have.length', 1);
		cy.get(
			'.ss__recommendation-bundle .ss__recommendation-bundle__wrapper__selector--seed .ss__recommendation-bundle__wrapper__selector__icon'
		).should('exist');

		// can set seed icon only with seed in carousel
		mount(
			<RecommendationBundle controller={controller} seedInCarousel={true} separatorIconSeedOnly={true} onAddToCart={cy.stub().as('onAddToCart')} />
		);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle__wrapper__selector__icon').should('have.length', 1);
		cy.get(
			'.ss__recommendation-bundle .ss__recommendation-bundle__wrapper__selector--seed .ss__recommendation-bundle__wrapper__selector__icon'
		).should('exist');

		//can set seed icon only false with seed not in carousel
		mount(<RecommendationBundle controller={controller} separatorIconSeedOnly={false} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle__wrapper__selector__icon').should('have.length', 5);

		//can set seed icon only false with seed in carousel
		mount(
			<RecommendationBundle controller={controller} seedInCarousel={true} separatorIconSeedOnly={false} onAddToCart={cy.stub().as('onAddToCart')} />
		);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle__wrapper__selector__icon').should('have.length', 5);
	});

	it('can set custom separator icons', () => {
		mount(
			<RecommendationBundle controller={controller} separatorIcon={'cog'} separatorIconSeedOnly={false} onAddToCart={cy.stub().as('onAddToCart')} />
		);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle__wrapper__selector__icon.ss__icon--cog').should('have.length', 5);
	});

	it('can set ctaInline prop', () => {
		mount(<RecommendationBundle controller={controller} ctaInline={true} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle .ss__recommendation-bundle__wrapper .ss__recommendation-bundle__wrapper__cta').should('exist');

		mount(<RecommendationBundle controller={controller} ctaInline={false} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle .ss__recommendation-bundle__wrapper .ss__recommendation-bundle__wrapper__cta').should('not.exist');
		cy.get('.ss__recommendation-bundle .ss__recommendation-bundle__wrapper__cta').should('exist');
	});

	it('can set CTAicon', () => {
		//has default icon
		mount(<RecommendationBundle controller={controller} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get(
			'.ss__recommendation-bundle .ss__recommendation-bundle__wrapper .ss__recommendation-bundle__wrapper__cta .ss__recommendation-bundle__wrapper__cta__icon'
		).should('exist');

		mount(<RecommendationBundle controller={controller} ctaIcon={'cog'} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get(
			'.ss__recommendation-bundle .ss__recommendation-bundle__wrapper .ss__recommendation-bundle__wrapper__cta .ss__recommendation-bundle__wrapper__cta__icon'
		)
			.should('exist')
			.should('have.class', 'ss__icon--cog');

		mount(<RecommendationBundle controller={controller} ctaIcon={false} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get(
			'.ss__recommendation-bundle .ss__recommendation-bundle__wrapper .ss__recommendation-bundle__wrapper__cta .ss__recommendation-bundle__wrapper__cta__icon'
		).should('not.exist');
	});

	it('can disable styling', () => {
		mount(<RecommendationBundle controller={controller} onAddToCart={cy.stub().as('onAddToCart')} disableStyles />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle').should('satisfy', ($el) => {
			const classList = Array.from($el[0].classList);
			return classList.length == 1;
		});
	});

	it('renders with classname', () => {
		const className = 'classy';

		mount(<RecommendationBundle controller={controller} onAddToCart={cy.stub().as('onAddToCart')} className={className} />);

		cy.get('.ss__recommendation-bundle').should('exist');
		cy.get('.ss__recommendation-bundle').should('have.class', className);
	});

	it('is themeable with ThemeProvider', () => {
		mount(
			<ThemeProvider theme={theme}>
				<RecommendationBundle controller={controller} onAddToCart={cy.stub().as('onAddToCart')} />
			</ThemeProvider>
		);
		cy.get('.ss__recommendation-bundle').should('exist');
		const prev = cy.get('.ss__carousel__prev');
		prev.should('exist');
		prev.should('have.text', theme.components.recommendationBundle.carousel.prevButton);

		const next = cy.get('.ss__carousel__next');
		next.should('exist');
		next.should('have.text', theme.components.recommendationBundle.carousel.nextButton);
	});

	it('is themeable with theme prop', () => {
		mount(<RecommendationBundle theme={theme} controller={controller} onAddToCart={cy.stub().as('onAddToCart')} />);

		cy.get('.ss__recommendation-bundle').should('exist');

		const prev = cy.get('.ss__carousel__prev');
		prev.should('exist');
		prev.should('have.text', theme.components.recommendationBundle.carousel.prevButton);

		const next = cy.get('.ss__carousel__next');
		next.should('exist');
		next.should('have.text', theme.components.recommendationBundle.carousel.nextButton);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const themeOverride = {
			components: {
				recommendationBundle: {
					carousel: {
						prevButton: 'Prev Button Yo',
						nextButton: 'Next Button Yo',
					},
				},
			},
		};

		mount(
			<ThemeProvider theme={theme}>
				<RecommendationBundle controller={controller} theme={themeOverride} onAddToCart={cy.stub().as('onAddToCart')} />
			</ThemeProvider>
		);

		cy.get('.ss__recommendation-bundle').should('exist');

		const prev = cy.get('.ss__carousel__prev');
		prev.should('exist');
		prev.should('have.text', themeOverride.components.recommendationBundle.carousel.prevButton);
		prev.should('not.have.text', theme.components.recommendationBundle.carousel.prevButton);

		const next = cy.get('.ss__carousel__next');
		next.should('exist');
		next.should('have.text', themeOverride.components.recommendationBundle.carousel.nextButton);
		next.should('not.have.text', theme.components.recommendationBundle.carousel.nextButton);
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
			<RecommendationBundle
				controller={controller}
				breakpoints={customBreakpoints}
				theme={componentTheme}
				onAddToCart={cy.stub().as('onAddToCart')}
			/>
		);

		cy.get('.theme-detail-slot').should('have.length', 0);
		cy.get('.breakpoint-detail-slot').should('have.length', 5);

		// Change the viewport to 500px.
		cy.viewport(500, 750);

		cy.get('.theme-detail-slot').should('have.length', 5);
		cy.get('.breakpoint-detail-slot').should('have.length', 0);

		// reset the viewport to 1200px.
		cy.viewport(1200, 750);
	});
});

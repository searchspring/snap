import 'whatwg-fetch';
import { h } from 'preact';

import { RecommendationStore } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker, BeaconType, BeaconCategory } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Client } from '@searchspring/snap-client';
import { RecommendationController } from '@searchspring/snap-controller';

import { Recommendation } from '../../../../src/components/Organisms/Recommendation';
import { mount } from '@cypress/react';
import { ThemeProvider } from '../../../../src/providers';

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
		recommendation: {
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

describe('Recommendation Component', async () => {
	before(async () => {
		await controller.search();
	});

	it('tracks as expected', () => {
		const spy = cy.spy(controller.tracker.track, 'event').as('trackfn');

		mount(
			<Recommendation controller={controller}>
				{controller.store.results.map((result, idx) => (
					<div className={'findMe'} key={idx}>
						<div className="result">{result.mappings.core?.name}</div>
					</div>
				))}
			</Recommendation>
		);

		cy.get('.ss__recommendation')
			.should('exist')
			.then(() => {
				cy.get('@trackfn').its('callCount').should('eq', 27);

				//todo - get these beacon tests working again, or move back into jest if possible.

				// expect(spy).to.be.calledOn({
				//     type: BeaconType.PROFILE_RENDER,
				//     category: BeaconCategory.RECOMMENDATIONS,
				//     context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
				//     event: {
				//         context: {
				//             placement: controller.store.profile.placement,
				//             tag: controller.store.profile.tag,
				//             type: 'product-recommendation',
				//         },
				//         profile: {
				//             placement: controller.store.profile.placement,
				//             tag: controller.store.profile.tag,
				//             templateId: 'aefcf718-8514-44c3-bff6-80c15dbc42fc',
				//             threshold: 4,
				//         },
				//     },
				// },)
				// cy.get('@trackfn').should('have.been.calledWith', ({
				//     type: BeaconType.PROFILE_RENDER,
				//     category: BeaconCategory.RECOMMENDATIONS,
				//     context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
				//     event: {
				//         context: {
				//             placement: controller.store.profile.placement,
				//             tag: controller.store.profile.tag,
				//             type: 'product-recommendation',
				//         },
				//         profile: {
				//             placement: controller.store.profile.placement,
				//             tag: controller.store.profile.tag,
				//             templateId: 'aefcf718-8514-44c3-bff6-80c15dbc42fc',
				//             threshold: 4,
				//         },
				//     },
				// }));

				// other 20 calls are for product render
				// controller.store.results.map((result) => {
				//     cy.get('@trackfn').should('be.calledWith', ({
				//         type: BeaconType.PROFILE_PRODUCT_RENDER,
				//         category: BeaconCategory.RECOMMENDATIONS,
				//         context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
				//         pid: controller.events.render!.id,
				//         event: {
				//             context: {
				//                 placement: controller.store.profile.placement,
				//                 tag: controller.store.profile.tag,
				//                 type: 'product-recommendation',
				//             },
				//             product: {
				//                 id: result.id,
				//                 seed: undefined,
				//                 mappings: {
				//                     core: result.mappings.core,
				//                 },
				//             },
				//         },
				//     }));
				// });
			});

		// // trackfn.mockClear();

		// //click the next button
		// cy.get('.ss__carousel__next').click();

		// expect('@trackfn').to.be.calledWith({

		// // expect(trackfn).toHaveBeenCalledWith({
		// 	type: BeaconType.PROFILE_CLICK,
		// 	category: BeaconCategory.RECOMMENDATIONS,
		// 	context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
		// 	event: {
		// 		context: {
		// 			action: 'navigate',
		// 			placement: controller.store.profile.placement,
		// 			tag: controller.store.profile.tag,
		// 			type: 'product-recommendation',
		// 		},
		// 		profile: {
		// 			placement: controller.store.profile.placement,
		// 			tag: controller.store.profile.tag,
		// 			templateId: 'aefcf718-8514-44c3-bff6-80c15dbc42fc',
		// 			threshold: 4,
		// 		},
		// 	},
		// });

		// cy.get('@trackfn.all').should('have.length', 22);

		// // expect(trackfn).toHaveBeenCalledTimes(1);

		// // trackfn.mockClear();

		// for (let i = 0; i < 21; i++) {
		// 	// @ts-ignore
		// 	const [callback] = window.IntersectionObserver.mock.calls[i];

		// 	callback([
		// 		{
		// 			isIntersecting: true,
		// 			intersectionRatio: 10,
		// 		},
		// 	]);
		// }

		// await waitFor(() => {
		// 	expect(trackfn).toHaveBeenCalledTimes(21);
		// });

		// // profile impression
		// expect(trackfn).toHaveBeenNthCalledWith(1, {
		// 	type: BeaconType.PROFILE_IMPRESSION,
		// 	category: BeaconCategory.RECOMMENDATIONS,
		// 	context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
		// 	event: {
		// 		context: {
		// 			placement: controller.store.profile.placement,
		// 			tag: controller.store.profile.tag,
		// 			type: 'product-recommendation',
		// 		},
		// 		profile: {
		// 			placement: controller.store.profile.placement,
		// 			tag: controller.store.profile.tag,
		// 			templateId: 'aefcf718-8514-44c3-bff6-80c15dbc42fc',
		// 			threshold: 4,
		// 		},
		// 	},
		// });

		// // next 4 results should have done impression tracking
		// controller.store.results.map((result) => {
		// 	cy.get('@trackfn').should('be.calledWith', Cypress.sinon.match.object).should('include', {
		// 		type: BeaconType.PROFILE_PRODUCT_IMPRESSION,
		// 		category: BeaconCategory.RECOMMENDATIONS,
		// 		context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
		// 		event: {
		// 			context: {
		// 				placement: controller.store.profile.placement,
		// 				tag: controller.store.profile.tag,
		// 				type: 'product-recommendation',
		// 			},
		// 			product: {
		// 				id: result.id,
		// 				seed: undefined,
		// 				mappings: {
		// 					core: result.mappings.core,
		// 				},
		// 			},
		// 		},
		// 		pid: controller.events.impression?.id,
		// 	})
		// });

		// trackfn.mockClear();
	});

	it('renders with results', () => {
		mount(
			<Recommendation title="hi" controller={controller}>
				{controller.store.results.map((result, idx) => (
					<div className="result" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</Recommendation>
		);
		cy.get('.ss__recommendation').should('exist');
		cy.get('.ss__carousel__prev').should('exist');
		cy.get('.ss__carousel__next').should('exist');
		cy.get('.swiper-slide:not(.swiper-slide-duplicate) .result').should('have.length', 20);
	});

	it('can disable styling', () => {
		mount(
			<Recommendation controller={controller} disableStyles>
				{controller.store.results.map((result, idx) => (
					<div className="result" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</Recommendation>
		);

		cy.get('.ss__recommendation').should('exist');
		cy.get('.ss__recommendation').should('satisfy', ($el) => {
			const classList = Array.from($el[0].classList);
			return classList.length == 1;
		});
	});

	it('renders with classname', () => {
		const className = 'classy';

		mount(
			<Recommendation controller={controller} className={className}>
				{controller.store.results.map((result, idx) => (
					<div className="result" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</Recommendation>
		);

		cy.get('.ss__recommendation').should('exist');
		cy.get('.ss__recommendation').should('have.class', className);
	});

	it('is themeable with ThemeProvider', () => {
		mount(
			<ThemeProvider theme={theme}>
				<Recommendation controller={controller}>
					{controller.store.results.map((result, idx) => (
						<div className="findMe" key={idx}>
							{result.mappings.core?.name}
						</div>
					))}
				</Recommendation>
			</ThemeProvider>
		);

		cy.get('.ss__recommendation').should('exist');
		cy.get('.findMe').should('exist');

		const prev = cy.get('.ss__carousel__prev');
		prev.should('exist');
		prev.should('have.text', theme.components.recommendation.prevButton);

		const next = cy.get('.ss__carousel__next');
		next.should('exist');
		next.should('have.text', theme.components.recommendation.nextButton);
	});

	it('is themeable with theme prop', () => {
		mount(
			<Recommendation controller={controller} theme={theme}>
				{controller.store.results.map((result, idx) => (
					<div className="findMe" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</Recommendation>
		);

		cy.get('.ss__recommendation').should('exist');
		cy.get('.findMe').should('exist');

		const prev = cy.get('.ss__carousel__prev');
		prev.should('exist');
		prev.should('have.text', theme.components.recommendation.prevButton);

		const next = cy.get('.ss__carousel__next');
		next.should('exist');
		next.should('have.text', theme.components.recommendation.nextButton);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const themeOverride = {
			components: {
				recommendation: {
					prevButton: 'Prev Button Yo',
					nextButton: 'Next Button Yo',
				},
			},
		};

		mount(
			<ThemeProvider theme={theme}>
				<Recommendation controller={controller} theme={themeOverride}>
					{controller.store.results.map((result, idx) => (
						<div className="findMe" key={idx}>
							{result.mappings.core?.name}
						</div>
					))}
				</Recommendation>
			</ThemeProvider>
		);

		cy.get('.ss__recommendation').should('exist');
		cy.get('.findMe').should('exist');

		const prev = cy.get('.ss__carousel__prev');
		prev.should('exist');
		prev.should('have.text', themeOverride.components.recommendation.prevButton);
		prev.should('not.have.text', theme.components.recommendation.prevButton);

		const next = cy.get('.ss__carousel__next');
		next.should('exist');
		next.should('have.text', themeOverride.components.recommendation.nextButton);
		next.should('not.have.text', theme.components.recommendation.nextButton);
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

		mount(<Recommendation controller={controller} breakpoints={customBreakpoints} theme={componentTheme} />);

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

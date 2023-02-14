import 'whatwg-fetch';
import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';

import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../providers/theme';
import { RecommendationStore, RecommendationStoreConfig } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker, BeaconType, BeaconCategory } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { MockClient } from '@searchspring/snap-shared';
import { RecommendationController } from '@searchspring/snap-controller';

import { Recommendation } from './Recommendation';

const globals = { siteId: '8uyt2m' };

const recommendConfig: RecommendationStoreConfig = {
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

describe('Recommendation Component', () => {
	beforeAll(() => {
		const mock = jest.fn(() => ({
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn(),
		}));

		//@ts-ignore
		window.IntersectionObserver = mock;
	});

	afterAll(() => {
		// @ts-ignore
		window.IntersectionObserver.mockReset();
	});
	it('renders with results', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals, { mode: 'development' }),
		});

		await controller.search();

		const rendered = render(
			<Recommendation controller={controller}>
				{controller.store.results.map((result, idx) => (
					<div className="result" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</Recommendation>
		);

		const recommendationWrapper = rendered.container.querySelector('.ss__recommendation');
		const prevButton = rendered.container.querySelector('.ss__carousel__prev');
		const nextButton = rendered.container.querySelector('.ss__carousel__next');
		const results = rendered.container.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate) .result'); // exclude duplicates

		expect(recommendationWrapper).toBeInTheDocument();
		expect(prevButton).toBeInTheDocument();
		expect(nextButton).toBeInTheDocument();
		expect(results).toHaveLength(20);

		// @ts-ignore
		window.IntersectionObserver.mockClear();
	});

	it('tracks as expected', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals, { mode: 'development' }),
		});

		const trackfn = jest.spyOn(controller.tracker.track, 'event');

		await controller.search();

		const rendered = render(
			<Recommendation controller={controller}>
				{controller.store.results.map((result, idx) => (
					<div className={'findMe'} key={idx}>
						<div className="result">{result.mappings.core?.name}</div>
					</div>
				))}
			</Recommendation>
		);

		const next = rendered.container.querySelector('.ss__carousel__next')!;

		expect(trackfn).toHaveBeenCalledTimes(21);

		expect(trackfn).toHaveBeenCalledWith({
			type: BeaconType.PROFILE_RENDER,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
			event: {
				context: {
					placement: controller.store.profile.placement,
					tag: controller.store.profile.tag,
					type: 'product-recommendation',
				},
				profile: {
					placement: controller.store.profile.placement,
					tag: controller.store.profile.tag,
					templateId: 'aefcf718-8514-44c3-bff6-80c15dbc42fc',
					threshold: 4,
				},
			},
		});

		// other 20 calls are for product render
		controller.store.results.map((result) => {
			expect(trackfn).toHaveBeenCalledWith({
				type: BeaconType.PROFILE_PRODUCT_RENDER,
				category: BeaconCategory.RECOMMENDATIONS,
				context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
				pid: controller.events.render!.id,
				event: {
					context: {
						placement: controller.store.profile.placement,
						tag: controller.store.profile.tag,
						type: 'product-recommendation',
					},
					product: {
						id: result.id,
						seed: undefined,
						mappings: {
							core: result.mappings.core,
						},
					},
				},
			});
		});

		trackfn.mockClear();

		//click the next button
		userEvent.click(next);

		expect(trackfn).toHaveBeenCalledWith({
			type: BeaconType.PROFILE_CLICK,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
			event: {
				context: {
					action: 'navigate',
					placement: controller.store.profile.placement,
					tag: controller.store.profile.tag,
					type: 'product-recommendation',
				},
				profile: {
					placement: controller.store.profile.placement,
					tag: controller.store.profile.tag,
					templateId: 'aefcf718-8514-44c3-bff6-80c15dbc42fc',
					threshold: 4,
				},
			},
		});

		expect(trackfn).toHaveBeenCalledTimes(1);

		trackfn.mockClear();

		for (let i = 0; i < 21; i++) {
			// @ts-ignore
			let [callback] = window.IntersectionObserver.mock.calls[i];

			callback([
				{
					isIntersecting: true,
					intersectionRatio: 10,
				},
			]);
		}

		await waitFor(() => {
			expect(trackfn).toHaveBeenCalledTimes(21);
		});

		// profile impression
		expect(trackfn).toHaveBeenNthCalledWith(1, {
			type: BeaconType.PROFILE_IMPRESSION,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
			event: {
				context: {
					placement: controller.store.profile.placement,
					tag: controller.store.profile.tag,
					type: 'product-recommendation',
				},
				profile: {
					placement: controller.store.profile.placement,
					tag: controller.store.profile.tag,
					templateId: 'aefcf718-8514-44c3-bff6-80c15dbc42fc',
					threshold: 4,
				},
			},
		});

		// next 4 results should have done impression tracking
		controller.store.results.map((result) => {
			expect(trackfn).toHaveBeenCalledWith({
				type: BeaconType.PROFILE_PRODUCT_IMPRESSION,
				category: BeaconCategory.RECOMMENDATIONS,
				context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
				pid: controller.events.impression?.id,
				event: {
					context: {
						placement: controller.store.profile.placement,
						tag: controller.store.profile.tag,
						type: 'product-recommendation',
					},
					product: {
						id: result.id,
						seed: undefined,
						mappings: {
							core: result.mappings.core,
						},
					},
				},
			});
		});

		trackfn.mockClear();
	});

	it('can disable styling', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals, { mode: 'development' }),
		});

		await controller.search();

		const rendered = render(
			<Recommendation controller={controller} disableStyles>
				{controller.store.results.map((result, idx) => (
					<div className="result" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</Recommendation>
		);

		const CarouselElement = rendered.container.querySelector('.ss__recommendation');
		expect(CarouselElement?.classList.length).toBe(1);
	});

	it('renders with classname', async () => {
		const className = 'classy';
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals, { mode: 'development' }),
		});

		await controller.search();

		const rendered = render(
			<Recommendation controller={controller} className={className}>
				{controller.store.results.map((result, idx) => (
					<div className="result" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</Recommendation>
		);
		const CarouselElement = rendered.container.querySelector('.ss__recommendation');
		expect(CarouselElement).toBeInTheDocument();
		expect(CarouselElement).toHaveClass(className);
	});

	it('is themeable with ThemeProvider', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals, { mode: 'development' }),
		});

		await controller.search();

		const rendered = render(
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
		const ChildElement = rendered.container.querySelector('.findMe');
		expect(ChildElement).toBeInTheDocument();

		const prev = rendered.container.querySelector('.ss__carousel__prev');
		const next = rendered.container.querySelector('.ss__carousel__next');
		expect(prev).toBeInTheDocument();
		expect(next).toBeInTheDocument();

		expect(prev).toHaveTextContent(theme.components.recommendation.prevButton);
		expect(next).toHaveTextContent(theme.components.recommendation.nextButton);
	});

	it('is themeable with theme prop', async () => {
		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals, { mode: 'development' }),
		});

		await controller.search();

		const rendered = render(
			<Recommendation controller={controller} theme={theme}>
				{controller.store.results.map((result, idx) => (
					<div className="findMe" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</Recommendation>
		);

		const ChildElement = rendered.container.querySelector('.findMe');
		expect(ChildElement).toBeInTheDocument();

		const prev = rendered.container.querySelector('.ss__carousel__prev');
		const next = rendered.container.querySelector('.ss__carousel__next');
		expect(prev).toBeInTheDocument();
		expect(next).toBeInTheDocument();

		expect(prev).toHaveTextContent(theme.components.recommendation.prevButton);
		expect(next).toHaveTextContent(theme.components.recommendation.nextButton);
	});

	it('is themeable with theme prop overrides ThemeProvider', async () => {
		const themeOverride = {
			components: {
				recommendation: {
					prevButton: 'Prev Button Yo',
					nextButton: 'Next Button Yo',
				},
			},
		};

		const controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals, { mode: 'development' }),
		});

		await controller.search();

		const rendered = render(
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
		const ChildElement = rendered.container.querySelector('.findMe');
		expect(ChildElement).toBeInTheDocument();

		const prev = rendered.container.querySelector('.ss__carousel__prev');
		const next = rendered.container.querySelector('.ss__carousel__next');
		expect(prev).toBeInTheDocument();
		expect(next).toBeInTheDocument();

		expect(prev).not.toHaveTextContent(theme.components.recommendation.prevButton);
		expect(next).not.toHaveTextContent(theme.components.recommendation.nextButton);

		expect(prev).toHaveTextContent(themeOverride.components.recommendation.prevButton);
		expect(next).toHaveTextContent(themeOverride.components.recommendation.nextButton);
	});
});

import 'whatwg-fetch';
import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../../providers/theme';
import { RecommendationStore, RecommendationStoreConfig } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker, BeaconType, BeaconCategory } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { MockClient } from '@searchspring/snap-shared';
import { RecommendationController } from '@searchspring/snap-controller';
import { RecommendationResultTracker } from './RecommendationResultTracker';
import { RecommendationProfileTracker } from '../ProfileTracker/RecommendationProfileTracker';

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
		RecommendationResultTracker: {
			className: 'themeClass',
		},
	},
};

describe('RecommendationResultTracker Component', () => {
	beforeEach(() => {
		const mock = jest.fn(() => ({
			observe: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn(),
		}));

		//@ts-ignore
		window.IntersectionObserver = mock;
	});

	afterEach(() => {
		//@ts-ignore
		window.IntersectionObserver.mockReset();
		jest.clearAllMocks();
	});

	afterAll(() => {
		// @ts-ignore
		window.IntersectionObserver.mockReset();
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
			<RecommendationProfileTracker controller={controller}>
				{controller.store.results.map((result, idx) => (
					<RecommendationResultTracker controller={controller} result={result}>
						<div className={'findMe'} key={idx}>
							<div className="result">{result.mappings.core?.name}</div>
						</div>
					</RecommendationResultTracker>
				))}
			</RecommendationProfileTracker>
		);

		await waitFor(() => {
			expect(trackfn).toHaveBeenCalledTimes(21);
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

		for (let i = 0; i < 21; i++) {
			// @ts-ignore
			const [callback] = window.IntersectionObserver.mock.calls[i];

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

		//results should have done impression tracking
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

		const resultElem = rendered.container.querySelector('.findMe');

		await userEvent.click(resultElem!);

		expect(trackfn).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				type: BeaconType.PROFILE_PRODUCT_CLICK,
				category: BeaconCategory.RECOMMENDATIONS,
				context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
				// pid: controller.events.click?.id,
				event: {
					context: {
						action: 'navigate',
						placement: controller.store.profile.placement,
						tag: controller.store.profile.tag,
						type: 'product-recommendation',
					},
					product: {
						id: controller.store.results[0].id,
						seed: undefined,
						mappings: {
							core: controller.store.results[0].mappings.core,
						},
					},
				},
			})
		);

		trackfn.mockClear();
	});

	it('can use track prop to disable tracking for impressions', async () => {
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
			<RecommendationProfileTracker controller={controller}>
				{controller.store.results.map((result, idx) => (
					<RecommendationResultTracker controller={controller} result={result} track={{ impression: false }}>
						<div className={'findMe'} key={idx}>
							<div className="result">{result.mappings.core?.name}</div>
						</div>
					</RecommendationResultTracker>
				))}
			</RecommendationProfileTracker>
		);

		await waitFor(() => {
			expect(trackfn).toHaveBeenCalledTimes(21);
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

		for (let i = 0; i < 21; i++) {
			// @ts-ignore
			const [callback] = window.IntersectionObserver.mock.calls[i];

			callback([
				{
					isIntersecting: true,
					intersectionRatio: 10,
				},
			]);
		}

		await waitFor(() => {
			expect(trackfn).not.toHaveBeenCalled();
		});

		const resultElem = rendered.container.querySelector('.findMe');

		await userEvent.click(resultElem!);

		expect(trackfn).toHaveBeenNthCalledWith(
			3,
			expect.objectContaining({
				type: BeaconType.PROFILE_PRODUCT_CLICK,
				category: BeaconCategory.RECOMMENDATIONS,
				context: controller.config.globals.siteId ? { website: { trackingCode: controller.config.globals.siteId } } : undefined,
				// pid: controller.events.click?.id,
				event: {
					context: {
						action: 'navigate',
						placement: controller.store.profile.placement,
						tag: controller.store.profile.tag,
						type: 'product-recommendation',
					},
					product: {
						id: controller.store.results[0].id,
						seed: undefined,
						mappings: {
							core: controller.store.results[0].mappings.core,
						},
					},
				},
			})
		);

		trackfn.mockClear();
	});

	it('can use track prop to disable tracking for clicks', async () => {
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
			<RecommendationProfileTracker controller={controller}>
				<div>
					{controller.store.results.map((result, idx) => (
						<RecommendationResultTracker controller={controller} result={result} track={{ click: false }}>
							<div className={'findMe'} key={idx}>
								<div className="result">{result.mappings.core?.name}</div>
							</div>
						</RecommendationResultTracker>
					))}
				</div>
			</RecommendationProfileTracker>
		);

		await waitFor(() => {
			expect(trackfn).toHaveBeenCalledTimes(21);
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

		for (let i = 0; i < 21; i++) {
			// @ts-ignore
			const [callback] = window.IntersectionObserver.mock.calls[i];

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

		//results should have done impression tracking
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

		const resultElem = rendered.container.querySelector('.findMe');

		expect(trackfn).toHaveBeenCalledTimes(0);

		await userEvent.click(resultElem!);

		expect(trackfn).toHaveBeenCalledTimes(1);

		expect(trackfn).toHaveBeenCalledWith({
			category: BeaconCategory.RECOMMENDATIONS,
			context: undefined,
			event: {
				context: {
					action: 'navigate',
					placement: controller.store.profile.placement,
					tag: controller.store.profile.tag,
					type: 'product-recommendation',
				},
				profile: {
					placement: controller.store.profile.placement,
					seed: undefined,
					tag: controller.store.profile.tag,
					templateId: 'aefcf718-8514-44c3-bff6-80c15dbc42fc',
					threshold: 4,
				},
			},
			type: BeaconType.PROFILE_CLICK,
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
			<RecommendationProfileTracker controller={controller}>
				{controller.store.results.map((result, idx) => (
					<RecommendationResultTracker controller={controller} result={result} disableStyles>
						<div className={'findMe'} key={idx}>
							<div className="result">{result.mappings.core?.name}</div>
						</div>
					</RecommendationResultTracker>
				))}
			</RecommendationProfileTracker>
		);

		const CarouselElement = rendered.container.querySelector('.ss__recommendation-result-tracker');
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
			<RecommendationProfileTracker controller={controller}>
				{controller.store.results.map((result, idx) => (
					<RecommendationResultTracker controller={controller} result={result} className={className}>
						<div className={'findMe'} key={idx}>
							<div className="result">{result.mappings.core?.name}</div>
						</div>
					</RecommendationResultTracker>
				))}
			</RecommendationProfileTracker>
		);
		const CarouselElement = rendered.container.querySelector('.ss__recommendation-result-tracker');
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
				<RecommendationProfileTracker controller={controller}>
					{controller.store.results.map((result, idx) => (
						<RecommendationResultTracker controller={controller} result={result}>
							<div className={'findMe'} key={idx}>
								<div className="result">{result.mappings.core?.name}</div>
							</div>
						</RecommendationResultTracker>
					))}
				</RecommendationProfileTracker>
			</ThemeProvider>
		);

		const ChildElement = rendered.container.querySelector('.findMe');
		expect(ChildElement).toBeInTheDocument();

		const CarouselElement = rendered.container.querySelector('.ss__recommendation-result-tracker');
		expect(CarouselElement).toBeInTheDocument();
		expect(CarouselElement).toHaveClass(theme.components.RecommendationResultTracker.className);
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
			<RecommendationProfileTracker controller={controller}>
				{controller.store.results.map((result, idx) => (
					<RecommendationResultTracker controller={controller} result={result} theme={theme}>
						<div className={'findMe'} key={idx}>
							<div className="result">{result.mappings.core?.name}</div>
						</div>
					</RecommendationResultTracker>
				))}
			</RecommendationProfileTracker>
		);

		const ChildElement = rendered.container.querySelector('.findMe');
		expect(ChildElement).toBeInTheDocument();

		const CarouselElement = rendered.container.querySelector('.ss__recommendation-result-tracker');
		expect(CarouselElement).toBeInTheDocument();
		expect(CarouselElement).toHaveClass(theme.components.RecommendationResultTracker.className);
	});

	it('is themeable with theme prop overrides ThemeProvider', async () => {
		const themeOverride = {
			components: {
				RecommendationResultTracker: {
					className: 'newTheme',
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
				<RecommendationProfileTracker controller={controller}>
					{controller.store.results.map((result, idx) => (
						<RecommendationResultTracker controller={controller} result={result} theme={themeOverride}>
							<div className={'findMe'} key={idx}>
								<div className="result">{result.mappings.core?.name}</div>
							</div>
						</RecommendationResultTracker>
					))}
				</RecommendationProfileTracker>
			</ThemeProvider>
		);
		const ChildElement = rendered.container.querySelector('.findMe');
		expect(ChildElement).toBeInTheDocument();

		const CarouselElement = rendered.container.querySelector('.ss__recommendation-result-tracker');
		expect(CarouselElement).toBeInTheDocument();
		expect(CarouselElement).not.toHaveClass(theme.components.RecommendationResultTracker.className);
		expect(CarouselElement).toHaveClass(themeOverride.components.RecommendationResultTracker.className);
	});
});

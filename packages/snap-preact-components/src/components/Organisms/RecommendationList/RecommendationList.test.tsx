import 'whatwg-fetch';
import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers/theme';
import { RecommendationStore, RecommendationStoreConfig } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker, BeaconType, BeaconCategory } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { MockClient } from '@searchspring/snap-shared';
import { RecommendationController } from '@searchspring/snap-controller';

import { RecommendationList } from './RecommendationList';

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
		recommendationList: {
			className: 'classyyy',
		},
	},
};

describe('RecommendationList Component', () => {
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
			<RecommendationList controller={controller}>
				{controller.store.results.map((result, idx) => (
					<div className="result" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</RecommendationList>
		);

		const recommendationWrapper = rendered.container.querySelector('.ss__recommendation-list');
		const results = rendered.container.querySelectorAll('.result');

		expect(recommendationWrapper).toBeInTheDocument();
		expect(results).toHaveLength(20);

		// @ts-ignore
		window.IntersectionObserver.mockClear();
	});

	it('renders with limited results', async () => {
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
		const limit = 5;
		const rendered = render(
			<RecommendationList limit={limit} controller={controller}>
				{controller.store.results.map((result, idx) => (
					<div className="result" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</RecommendationList>
		);

		const recommendationWrapper = rendered.container.querySelector('.ss__recommendation-list');
		const results = rendered.container.querySelectorAll('.result');

		expect(recommendationWrapper).toBeInTheDocument();
		expect(results).toHaveLength(limit);

		// @ts-ignore
		window.IntersectionObserver.mockClear();
	});

	it('renders vertical', async () => {
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
			<RecommendationList vertical={true} controller={controller}>
				{controller.store.results.map((result, idx) => (
					<div className="result" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</RecommendationList>
		);

		const recommendationWrapper = rendered.container.querySelector('.ss__recommendation-list__result-wrapper');

		expect(recommendationWrapper).toBeInTheDocument();
		const styles = getComputedStyle(recommendationWrapper!);
		expect(styles.flexDirection).toBe('column');

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
			<RecommendationList controller={controller}>
				{controller.store.results.map((result, idx) => (
					<div className={'findMe'} key={idx}>
						<div className="result">{result.mappings.core?.name}</div>
					</div>
				))}
			</RecommendationList>
		);

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
			<RecommendationList controller={controller} disableStyles>
				{controller.store.results.map((result, idx) => (
					<div className="result" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</RecommendationList>
		);

		const CarouselElement = rendered.container.querySelector('.ss__recommendation-list');
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
			<RecommendationList controller={controller} className={className}>
				{controller.store.results.map((result, idx) => (
					<div className="result" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</RecommendationList>
		);
		const CarouselElement = rendered.container.querySelector('.ss__recommendation-list');
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
				<RecommendationList controller={controller}>
					{controller.store.results.map((result, idx) => (
						<div className="findMe" key={idx}>
							{result.mappings.core?.name}
						</div>
					))}
				</RecommendationList>
			</ThemeProvider>
		);
		const ChildElement = rendered.container.querySelector('.findMe');
		expect(ChildElement).toBeInTheDocument();

		const elem = rendered.container.querySelector('.ss__recommendation-list');
		expect(elem).toBeInTheDocument();
		expect(elem?.classList).toContain(theme.components.recommendationList.className);
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
			<RecommendationList controller={controller} theme={theme}>
				{controller.store.results.map((result, idx) => (
					<div className="findMe" key={idx}>
						{result.mappings.core?.name}
					</div>
				))}
			</RecommendationList>
		);

		const ChildElement = rendered.container.querySelector('.findMe');
		expect(ChildElement).toBeInTheDocument();

		const elem = rendered.container.querySelector('.ss__recommendation-list');
		expect(elem).toBeInTheDocument();

		expect(elem?.classList).toContain(theme.components.recommendationList.className);
	});

	it('is themeable with theme prop overrides ThemeProvider', async () => {
		const themeOverride = {
			components: {
				recommendationList: {
					className: 'not_classy',
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
				<RecommendationList controller={controller} theme={themeOverride}>
					{controller.store.results.map((result, idx) => (
						<div className="findMe" key={idx}>
							{result.mappings.core?.name}
						</div>
					))}
				</RecommendationList>
			</ThemeProvider>
		);
		const ChildElement = rendered.container.querySelector('.findMe');
		expect(ChildElement).toBeInTheDocument();

		const elem = rendered.container.querySelector('.ss__recommendation-list');
		expect(elem).toBeInTheDocument();

		expect(elem?.classList).not.toContain(theme.components.recommendationList.className);

		expect(elem?.classList).toContain(themeOverride.components.recommendationList.className);
	});
});

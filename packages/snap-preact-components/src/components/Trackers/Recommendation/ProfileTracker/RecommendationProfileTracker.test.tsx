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

import { RecommendationProfileTracker } from './RecommendationProfileTracker';

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
		RecommendationProfileTracker: {
			className: 'themeClass',
		},
	},
};

describe('RecommendationProfileTracker Component', () => {
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
				<div className="title">some title</div>
				{controller.store.results.map((result, idx) => (
					<div className={'findMe'} key={idx}>
						<div className="result">{result.mappings.core?.name}</div>
					</div>
				))}
			</RecommendationProfileTracker>
		);

		const title = rendered.container.querySelector('.title')!;

		expect(trackfn).toHaveBeenCalledTimes(1);

		expect(trackfn).toHaveBeenCalledWith({
			type: BeaconType.PROFILE_RENDER,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals?.siteId ? { website: { trackingCode: controller.config.globals?.siteId } } : undefined,
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

		trackfn.mockClear();

		//click the title
		userEvent.click(title);

		expect(trackfn).toHaveBeenCalledWith({
			type: BeaconType.PROFILE_CLICK,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals?.siteId ? { website: { trackingCode: controller.config.globals?.siteId } } : undefined,
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

		// @ts-ignore
		const [callback] = window.IntersectionObserver.mock.calls[0];
		callback([
			{
				isIntersecting: true,
				intersectionRatio: 10,
			},
		]);

		await waitFor(() => {
			expect(trackfn).toHaveBeenCalledTimes(1);
		});

		// profile impression
		expect(trackfn).toHaveBeenNthCalledWith(1, {
			type: BeaconType.PROFILE_IMPRESSION,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals?.siteId ? { website: { trackingCode: controller.config.globals?.siteId } } : undefined,
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
		trackfn.mockClear();
	});

	it('can use a component as a child. ', async () => {
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
		const ChildComponent = ({ controller }: { controller: RecommendationController }) => {
			return (
				<div>
					<div className="title">some title</div>
					{controller.store.results.map((result: any, idx: number) => (
						<div className={'findMe'} key={idx}>
							<div className="result">{result.mappings.core?.name}</div>
						</div>
					))}
				</div>
			);
		};
		await controller.search();

		const rendered = render(
			<RecommendationProfileTracker controller={controller}>
				<ChildComponent controller={controller} />
			</RecommendationProfileTracker>
		);

		const title = rendered.container.querySelector('.title')!;

		expect(trackfn).toHaveBeenCalledTimes(1);

		expect(trackfn).toHaveBeenCalledWith({
			type: BeaconType.PROFILE_RENDER,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals?.siteId ? { website: { trackingCode: controller.config.globals?.siteId } } : undefined,
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

		trackfn.mockClear();

		//click the title
		userEvent.click(title);

		expect(trackfn).toHaveBeenCalledWith({
			type: BeaconType.PROFILE_CLICK,
			category: BeaconCategory.RECOMMENDATIONS,
			context: controller.config.globals?.siteId ? { website: { trackingCode: controller.config.globals?.siteId } } : undefined,
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
			<RecommendationProfileTracker controller={controller} disableStyles>
				<div className="title">some title</div>
				{controller.store.results.map((result, idx) => (
					<div className={'findMe'} key={idx}>
						<div className="result">{result.mappings.core?.name}</div>
					</div>
				))}
			</RecommendationProfileTracker>
		);

		const CarouselElement = rendered.container.querySelector('.ss__recommendation-profile-tracker');
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
			<RecommendationProfileTracker controller={controller} className={className}>
				<div className="title">some title</div>
				{controller.store.results.map((result, idx) => (
					<div className={'findMe'} key={idx}>
						<div className="result">{result.mappings.core?.name}</div>
					</div>
				))}
			</RecommendationProfileTracker>
		);
		const CarouselElement = rendered.container.querySelector('.ss__recommendation-profile-tracker');
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
					<div className="title">some title</div>
					{controller.store.results.map((result, idx) => (
						<div className={'findMe'} key={idx}>
							<div className="result">{result.mappings.core?.name}</div>
						</div>
					))}
				</RecommendationProfileTracker>
			</ThemeProvider>
		);
		const ChildElement = rendered.container.querySelector('.findMe');
		expect(ChildElement).toBeInTheDocument();

		const CarouselElement = rendered.container.querySelector('.ss__recommendation-profile-tracker');
		expect(CarouselElement).toBeInTheDocument();
		expect(CarouselElement).toHaveClass(theme.components.RecommendationProfileTracker.className);
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
			<RecommendationProfileTracker controller={controller} theme={theme}>
				<div className="title">some title</div>
				{controller.store.results.map((result, idx) => (
					<div className={'findMe'} key={idx}>
						<div className="result">{result.mappings.core?.name}</div>
					</div>
				))}
			</RecommendationProfileTracker>
		);

		const ChildElement = rendered.container.querySelector('.findMe');
		expect(ChildElement).toBeInTheDocument();

		const CarouselElement = rendered.container.querySelector('.ss__recommendation-profile-tracker');
		expect(CarouselElement).toBeInTheDocument();
		expect(CarouselElement).toHaveClass(theme.components.RecommendationProfileTracker.className);
	});

	it('is themeable with theme prop overrides ThemeProvider', async () => {
		const themeOverride = {
			components: {
				RecommendationProfileTracker: {
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
				<RecommendationProfileTracker controller={controller} theme={themeOverride}>
					<div className="title">some title</div>
					{controller.store.results.map((result, idx) => (
						<div className={'findMe'} key={idx}>
							<div className="result">{result.mappings.core?.name}</div>
						</div>
					))}
				</RecommendationProfileTracker>
			</ThemeProvider>
		);
		const ChildElement = rendered.container.querySelector('.findMe');
		expect(ChildElement).toBeInTheDocument();

		const CarouselElement = rendered.container.querySelector('.ss__recommendation-profile-tracker');
		expect(CarouselElement).toBeInTheDocument();
		expect(CarouselElement).not.toHaveClass(theme.components.RecommendationProfileTracker.className);
		expect(CarouselElement).toHaveClass(themeOverride.components.RecommendationProfileTracker.className);
	});
});

import 'whatwg-fetch';
import { h, Fragment } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../providers/theme';
import { RecommendationStore, RecommendationStoreConfig } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { MockClient } from '@searchspring/snap-shared';
import { RecommendationController } from '@searchspring/snap-controller';
import { ResultTracker } from './ResultTracker';

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
		ResultTracker: {
			className: 'themeClass',
		},
	},
};

describe('ResultTracker Component', () => {
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

	describe('RecommendationController Usage', () => {
		it.skip('tracks as expected', async () => {
			const controller = new RecommendationController(recommendConfig, {
				client: new MockClient(globals, {}),
				store: new RecommendationStore(recommendConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals, { mode: 'development' }),
			});

			const renderTrackfn = jest.spyOn(controller.track.product, 'render');
			const impressionTrackfn = jest.spyOn(controller.track.product, 'impression');
			const clickTrackfn = jest.spyOn(controller.track.product, 'click');

			await controller.search();

			const rendered = render(
				<Fragment>
					{controller.store.results.map((result, idx) => (
						<ResultTracker controller={controller} result={result}>
							<div className={`findMe findMe${idx}`} key={idx}>
								<div className="result">{result.mappings.core?.name}</div>
							</div>
						</ResultTracker>
					))}
				</Fragment>
			);

			await waitFor(() => {
				expect(renderTrackfn).toHaveBeenCalledTimes(20);
			});

			// 20 calls are for product render
			controller.store.results.map((result) => {
				expect(renderTrackfn).toHaveBeenCalledWith(result);
			});

			renderTrackfn.mockClear();

			for (let i = 0; i < 20; i++) {
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
				expect(impressionTrackfn).toHaveBeenCalledTimes(20);
			});

			// results should have done impression tracking
			controller.store.results.map((result) => {
				expect(impressionTrackfn).toHaveBeenCalledWith(result);
			});

			impressionTrackfn.mockClear();

			const resultElem = rendered.container.querySelector('.findMe0');

			await userEvent.click(resultElem!);

			expect(clickTrackfn).toHaveBeenCalledWith(expect.anything(), controller.store.results[0]);

			clickTrackfn.mockClear();
		});

		it.skip('can use track prop to disable tracking for renders', async () => {
			const controller = new RecommendationController(recommendConfig, {
				client: new MockClient(globals, {}),
				store: new RecommendationStore(recommendConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals, { mode: 'development' }),
			});

			const renderTrackfn = jest.spyOn(controller.track.product, 'render');
			const impressionTrackfn = jest.spyOn(controller.track.product, 'impression');

			await controller.search();

			const rendered = render(
				<Fragment>
					{controller.store.results.map((result, idx) => (
						<ResultTracker controller={controller} result={result} track={{ render: false }}>
							<div className={'findMe'} key={idx}>
								<div className="result">{result.mappings.core?.name}</div>
							</div>
						</ResultTracker>
					))}
				</Fragment>
			);

			await waitFor(() => {
				expect(renderTrackfn).not.toHaveBeenCalled();
			});

			for (let i = 0; i < 20; i++) {
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
				expect(impressionTrackfn).toHaveBeenCalledTimes(20);
			});

			impressionTrackfn.mockClear();
		});

		it.skip('can use track prop to disable tracking for impressions', async () => {
			const controller = new RecommendationController(recommendConfig, {
				client: new MockClient(globals, {}),
				store: new RecommendationStore(recommendConfig, services),
				urlManager,
				eventManager: new EventManager(),
				profiler: new Profiler(),
				logger: new Logger(),
				tracker: new Tracker(globals, { mode: 'development' }),
			});

			const renderTrackfn = jest.spyOn(controller.track.product, 'render');
			const impressionTrackfn = jest.spyOn(controller.track.product, 'impression');

			await controller.search();

			const rendered = render(
				<Fragment>
					{controller.store.results.map((result, idx) => (
						<ResultTracker controller={controller} result={result} track={{ impression: false }}>
							<div className={'findMe'} key={idx}>
								<div className="result">{result.mappings.core?.name}</div>
							</div>
						</ResultTracker>
					))}
				</Fragment>
			);

			await waitFor(() => {
				expect(renderTrackfn).toHaveBeenCalledTimes(20);
			});

			for (let i = 0; i < 20; i++) {
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
				expect(impressionTrackfn).not.toHaveBeenCalled();
			});

			impressionTrackfn.mockClear();
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

			const clickTrackfn = jest.spyOn(controller.track.product, 'click');

			await controller.search();

			const rendered = render(
				<div>
					{controller.store.results.map((result, idx) => (
						<ResultTracker controller={controller} result={result} track={{ click: false }}>
							<div className={`findMe findMe${idx}`} key={idx}>
								<div className="result">{result.mappings.core?.name}</div>
							</div>
						</ResultTracker>
					))}
				</div>
			);
			const resultElem = rendered.container.querySelector('.findMe0');

			await userEvent.click(resultElem!);

			expect(clickTrackfn).not.toHaveBeenCalledWith(expect.anything(), controller.store.results[0]);

			clickTrackfn.mockClear();
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
				<Fragment>
					{controller.store.results.map((result, idx) => (
						<ResultTracker controller={controller} result={result} disableStyles>
							<div className={'findMe'} key={idx}>
								<div className="result">{result.mappings.core?.name}</div>
							</div>
						</ResultTracker>
					))}
				</Fragment>
			);

			const CarouselElement = rendered.container.querySelector('.ss__recommendation-result-tracker');
			expect(Array.from(CarouselElement!.classList)).toStrictEqual(['ss__result-tracker', 'ss__recommendation-result-tracker']);
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
				<Fragment>
					{controller.store.results.map((result, idx) => (
						<ResultTracker controller={controller} result={result} className={className}>
							<div className={'findMe'} key={idx}>
								<div className="result">{result.mappings.core?.name}</div>
							</div>
						</ResultTracker>
					))}
				</Fragment>
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
					{controller.store.results.map((result, idx) => (
						<ResultTracker controller={controller} result={result}>
							<div className={'findMe'} key={idx}>
								<div className="result">{result.mappings.core?.name}</div>
							</div>
						</ResultTracker>
					))}
				</ThemeProvider>
			);

			const ChildElement = rendered.container.querySelector('.findMe');
			expect(ChildElement).toBeInTheDocument();

			const CarouselElement = rendered.container.querySelector('.ss__recommendation-result-tracker');
			expect(CarouselElement).toBeInTheDocument();
			expect(CarouselElement).toHaveClass(theme.components.ResultTracker.className);
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
				<Fragment>
					{controller.store.results.map((result, idx) => (
						<ResultTracker controller={controller} result={result} theme={theme}>
							<div className={'findMe'} key={idx}>
								<div className="result">{result.mappings.core?.name}</div>
							</div>
						</ResultTracker>
					))}
				</Fragment>
			);

			const ChildElement = rendered.container.querySelector('.findMe');
			expect(ChildElement).toBeInTheDocument();

			const CarouselElement = rendered.container.querySelector('.ss__recommendation-result-tracker');
			expect(CarouselElement).toBeInTheDocument();
			expect(CarouselElement).toHaveClass(theme.components.ResultTracker.className);
		});

		it('is themeable with theme prop overrides ThemeProvider', async () => {
			const themeOverride = {
				components: {
					ResultTracker: {
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
					{controller.store.results.map((result, idx) => (
						<ResultTracker controller={controller} result={result} theme={themeOverride}>
							<div className={'findMe'} key={idx}>
								<div className="result">{result.mappings.core?.name}</div>
							</div>
						</ResultTracker>
					))}
				</ThemeProvider>
			);
			const ChildElement = rendered.container.querySelector('.findMe');
			expect(ChildElement).toBeInTheDocument();

			const CarouselElement = rendered.container.querySelector('.ss__recommendation-result-tracker');
			expect(CarouselElement).toBeInTheDocument();
			expect(CarouselElement).not.toHaveClass(theme.components.ResultTracker.className);
			expect(CarouselElement).toHaveClass(themeOverride.components.ResultTracker.className);
		});
	});
});

import { h } from 'preact';
import { RecommendationGrid } from './RecommendationGrid';
import 'whatwg-fetch';
import { render, waitFor } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers/theme';
import { RecommendationStore, RecommendationStoreConfig } from '@searchspring/snap-store-mobx';
import { UrlManager, QueryStringTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { Tracker } from '@searchspring/snap-tracker';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { MockClient } from '@searchspring/snap-shared';
import { RecommendationController } from '@searchspring/snap-controller';

const globals = { siteId: '8uyt2m' };

const recommendConfig: RecommendationStoreConfig = {
	id: 'search',
	tag: 'trending',
};

const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = {
	urlManager,
};
let controller: RecommendationController;

describe('RecommendationGrid Component', () => {
	beforeEach(async () => {
		controller = new RecommendationController(recommendConfig, {
			client: new MockClient(globals, {}),
			store: new RecommendationStore(recommendConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals, { mode: 'development' }),
		});

		await controller.search();
	});

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

	const theme = {
		components: {
			recommendationGrid: {
				className: 'classy',
			},
		},
	};

	it('renders list', () => {
		const rendered = render(<RecommendationGrid controller={controller} lazyRender={{ enabled: false }} />);

		const list = rendered.container.querySelector('.ss__recommendation-grid')!;
		expect(list).toBeInTheDocument();

		const resultElement = rendered.getByText(controller.store.results[0].mappings.core?.name!);
		expect(resultElement).toBeInTheDocument();
		const results = rendered.container.querySelectorAll('.ss__recommendation-grid__result');
		expect(results.length).toBe(controller.store.results.length);
	});

	it('renders title', () => {
		const titleText = 'my custom title';

		const rendered = render(<RecommendationGrid title={titleText} controller={controller} lazyRender={{ enabled: false }} />);

		const list = rendered.container.querySelector('.ss__recommendation-grid')!;
		expect(list).toBeInTheDocument();
		const titleElem = rendered.container.querySelector('.ss__recommendation-grid__title')!;
		expect(titleElem).toBeInTheDocument();
		expect(titleElem.innerHTML).toBe(titleText);
	});

	it('renders correct number of products when passing rows and columns', () => {
		const args = {
			rows: 2,
			columns: 3,
		};

		const rendered = render(<RecommendationGrid controller={controller} {...args} lazyRender={{ enabled: false }} />);
		const results = rendered.container.querySelectorAll('.ss__result');
		expect(results.length).toBe(args.columns * args.rows);
	});

	it('auto adjusts columns', () => {
		const args = {
			rows: 3,
		};

		const rendered = render(<RecommendationGrid controller={controller} {...args} lazyRender={{ enabled: false }} />);
		const elem = rendered.container.querySelector('.ss__recommendation-grid__results');
		const styles = getComputedStyle(elem!);

		expect(styles.gridTemplateColumns).toBe('repeat(7, 1fr)');
	});

	it('can use trim', () => {
		const args = {
			rows: 3,
			trim: true,
		};

		const rendered = render(<RecommendationGrid controller={controller} {...args} lazyRender={{ enabled: false }} />);
		const elem = rendered.container.querySelector('.ss__recommendation-grid__results');
		const styles = getComputedStyle(elem!);

		expect(styles.gridTemplateColumns).toBe('repeat(6, 1fr)');
	});

	it('renders custom rows and gapsize', () => {
		const args = {
			columns: 2,
			rows: 3,
			gapSize: '40px',
			lazyRender: { enabled: false },
		};

		const rendered = render(<RecommendationGrid controller={controller} {...args} lazyRender={{ enabled: false }} />);
		const resultsElement = rendered.container.querySelector('.ss__recommendation-grid')!;
		expect(resultsElement).toBeInTheDocument();
		const gridElem = rendered.container.querySelector('.ss__recommendation-grid__results');
		expect(gridElem).toBeInTheDocument();
		const resultsElementStyles = getComputedStyle(gridElem!);

		expect(resultsElementStyles.gridTemplateColumns).toBe(`repeat(${args.columns}, 1fr)`);
		expect(resultsElementStyles.gap).toBe(args.gapSize);

		const result = rendered.container.querySelectorAll('.ss__result')!;
		expect(result[0]).toBeInTheDocument();
	});

	it('can use breakpoints', async () => {
		const customBreakpoints = {
			0: {
				className: 'mobile',
			},
			700: {
				className: 'desktop',
			},
		};

		const args = {
			breakpoints: customBreakpoints,
		};
		const rendered = render(<RecommendationGrid controller={controller} {...args} />);
		const resultsElement = rendered.container.querySelector('.ss__recommendation-grid');

		expect(resultsElement).toBeInTheDocument();
		expect(resultsElement).toHaveClass('desktop');
		expect(resultsElement).not.toHaveClass('mobile');

		// Change the viewport to 500px.
		global.innerWidth = 500;

		// Trigger the window resize event.
		global.dispatchEvent(new Event('resize'));

		// to deal with render delay
		await waitFor(() => {
			expect(resultsElement).toHaveClass('mobile');
			expect(resultsElement).not.toHaveClass('desktop');
		});
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<RecommendationGrid controller={controller} className={className} lazyRender={{ enabled: false }} />);

		const resultsElement = rendered.container.querySelector('.ss__recommendation-grid');
		expect(resultsElement).toBeInTheDocument();
		expect(resultsElement).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<RecommendationGrid controller={controller} lazyRender={{ enabled: false }} disableStyles />);

		const resultsElement = rendered.container.querySelector('.ss__recommendation-grid');

		expect(resultsElement?.classList).toHaveLength(1);
	});

	it('is themeable with ThemeProvider', () => {
		const args = {
			controller: controller,
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<RecommendationGrid lazyRender={{ enabled: false }} {...args} />
			</ThemeProvider>
		);
		const resultsElement = rendered.container.querySelector('.ss__recommendation-grid')!;
		expect(resultsElement).toHaveClass(theme.components.recommendationGrid.className);
	});

	it('is themeable with theme prop', () => {
		const args = {
			controller: controller,
		};
		const rendered = render(<RecommendationGrid {...args} lazyRender={{ enabled: false }} theme={theme} />);
		const resultsElement = rendered.container.querySelector('.ss__recommendation-grid')!;
		expect(resultsElement).toHaveClass(theme.components.recommendationGrid.className);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const args = {
			controller: controller,
		};

		const globalTheme = {
			components: {
				recommendationGrid: {
					className: 'notClassy',
				},
			},
		};
		const componentTheme = {
			components: {
				recommendationGrid: {
					className: 'Classy',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<RecommendationGrid {...args} lazyRender={{ enabled: false }} theme={componentTheme} />
			</ThemeProvider>
		);

		const resultsElement = rendered.container.querySelector('.ss__recommendation-grid')!;
		expect(resultsElement).toHaveClass(componentTheme.components.recommendationGrid.className);
		expect(resultsElement).not.toHaveClass(globalTheme.components.recommendationGrid.className);
	});
});

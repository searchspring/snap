import { h } from 'preact';
import { RecommendationList } from './RecommendationList';
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

describe('Results Component', () => {
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
			recommendationList: {
				className: 'classy',
			},
		},
	};

	it('renders list', () => {
		const rendered = render(<RecommendationList controller={controller} />);

		const list = rendered.container.querySelector('.ss__recommendation-list')!;
		expect(list).toBeInTheDocument();
		const listStyles = getComputedStyle(list);
		expect(listStyles['grid-template-columns' as keyof CSSStyleDeclaration]).toBe('repeat(20, 1fr)');

		const resultElement = rendered.getByText(controller.store.results[0].mappings.core?.name!);
		expect(resultElement).toBeInTheDocument();
		const results = rendered.container.querySelectorAll('.ss__recommendation-list__result');
		expect(results.length).toBe(controller.store.results.length);
	});

	it('renders title', () => {
		const titleText = 'my custom title';

		const rendered = render(<RecommendationList title={titleText} controller={controller} />);

		const list = rendered.container.querySelector('.ss__recommendation-list')!;
		expect(list).toBeInTheDocument();
		const titleElem = rendered.container.querySelector('.ss__recommendation-list__title')!;
		expect(titleElem).toBeInTheDocument();
		expect(titleElem.innerHTML).toBe(titleText);
	});

	it('renders correct number of products when passing rows and columns', () => {
		const args = {
			rows: 2,
			columns: 3,
		};

		const rendered = render(<RecommendationList controller={controller} {...args} />);
		const results = rendered.container.querySelectorAll('.ss__result');
		expect(results.length).toBe(args.columns * args.rows);
	});

	it('renders custom rows and gapsize', () => {
		const args = {
			columns: 2,
			rows: 3,
			gapSize: '40px',
		};

		const rendered = render(<RecommendationList controller={controller} {...args} />);
		const resultsElement = rendered.container.querySelector('.ss__recommendation-list')!;
		const resultsElementStyles = getComputedStyle(resultsElement);

		expect(resultsElementStyles.gridTemplateColumns).toBe(`repeat(${args.columns}, 1fr)`);

		const result = rendered.container.querySelectorAll('.ss__result')!;

		expect(result[0]).toBeInTheDocument();
		const resultStyles = getComputedStyle(result[0]);
		expect(resultStyles.marginRight).toBe(args.gapSize);
		expect(resultStyles.marginBottom).toBe(args.gapSize);
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
		const rendered = render(<RecommendationList controller={controller} {...args} />);
		const resultsElement = rendered.container.querySelector('.ss__recommendation-list');

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
		const rendered = render(<RecommendationList controller={controller} className={className} />);

		const resultsElement = rendered.container.querySelector('.ss__recommendation-list');
		expect(resultsElement).toBeInTheDocument();
		expect(resultsElement).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<RecommendationList controller={controller} disableStyles />);

		const resultsElement = rendered.container.querySelector('.ss__recommendation-list');

		expect(resultsElement?.classList).toHaveLength(1);
	});

	it('is themeable with ThemeProvider', () => {
		const args = {
			controller: controller,
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<RecommendationList {...args} />
			</ThemeProvider>
		);
		const resultsElement = rendered.container.querySelector('.ss__recommendation-list')!;
		expect(resultsElement).toHaveClass(theme.components.recommendationList.className);
	});

	it('is themeable with theme prop', () => {
		const args = {
			controller: controller,
		};
		const rendered = render(<RecommendationList {...args} theme={theme} />);
		const resultsElement = rendered.container.querySelector('.ss__recommendation-list')!;
		expect(resultsElement).toHaveClass(theme.components.recommendationList.className);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const args = {
			controller: controller,
		};

		const globalTheme = {
			components: {
				recommendationList: {
					className: 'notClassy',
				},
			},
		};
		const componentTheme = {
			components: {
				recommendationList: {
					className: 'Classy',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<RecommendationList {...args} theme={componentTheme} />
			</ThemeProvider>
		);

		const resultsElement = rendered.container.querySelector('.ss__recommendation-list')!;
		expect(resultsElement).toHaveClass(componentTheme.components.recommendationList.className);
		expect(resultsElement).not.toHaveClass(globalTheme.components.recommendationList.className);
	});
});

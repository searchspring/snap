import { h } from 'preact';
import { render } from '@testing-library/preact';
import { Theme, ThemeProvider } from '../../../providers';
import { v4 as uuidv4 } from 'uuid';
import { SearchStore, SearchStoreConfig } from '@searchspring/snap-store-mobx';
import { SearchController, SearchControllerConfig } from '@searchspring/snap-controller';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { MockClient } from '@searchspring/snap-shared';
import { QueryStringTranslator, UrlManager, reactLinker } from '@searchspring/snap-url-manager';
import { SearchHorizontal } from './SearchHorizontal';

const globals = { siteId: '8uyt2m' };

const searchConfigDefault: SearchControllerConfig = {
	id: 'search',
	globals: {
		filters: [],
	},
	settings: {},
};

let searchConfig: SearchStoreConfig;
const urlManager = new UrlManager(new QueryStringTranslator(), reactLinker);
const services = { urlManager };
let controller: SearchController;

const mockClient = new MockClient(globals, {});

describe('SearchHorizontal Template Component', () => {
	beforeEach(async () => {
		searchConfig = { ...searchConfigDefault };
		searchConfig.id = uuidv4().split('-').join('');

		controller = new SearchController(searchConfig, {
			client: mockClient,
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		await controller.search();
	});

	it('renders', () => {
		const rendered = render(<SearchHorizontal controller={controller} />);
		const element = rendered.container.querySelector('.ss__search-horizontal');
		expect(element).toBeInTheDocument();
	});

	it('renders expected sub components', () => {
		const rendered = render(<SearchHorizontal controller={controller} />);
		const element = rendered.container.querySelector('.ss__search-horizontal')!;

		const searchHeader = rendered.container.querySelector('.ss__search-header');
		const facetsHorizontal = rendered.container.querySelector('.ss__facets-horizontal');

		const results = rendered.container.querySelector('.ss__results');
		const noResults = rendered.container.querySelector('.ss__no-results');

		const topToolBar = rendered.container.querySelector('.ss__search-horizontal__content__toolbar--top-toolbar');
		const middleToolBar = rendered.container.querySelector('.ss__search-horizontal__content__toolbar--middle-toolbar');
		const bottomToolBar = rendered.container.querySelector('.ss__search-horizontal__content__toolbar--bottom-toolbar');

		const toggleFiltersButton = rendered.container.querySelector('.ss__search-horizontal__sidebar-wrapper-toggle');
		const mobileSidebar = rendered.container.querySelector('.ss__mobile-sidebar__slideout');
		const dropdown = rendered.container.querySelector('.ss__search-horizontal__sidebar-wrapper-toggle');

		expect(element).toBeInTheDocument();
		expect(searchHeader).toBeInTheDocument();
		expect(facetsHorizontal).toBeInTheDocument();
		expect(results).toBeInTheDocument();
		expect(noResults).not.toBeInTheDocument();
		expect(topToolBar).toBeInTheDocument();
		expect(middleToolBar).not.toBeInTheDocument();
		expect(bottomToolBar).toBeInTheDocument();
		expect(toggleFiltersButton).not.toBeInTheDocument();
		expect(mobileSidebar).not.toBeInTheDocument();
		expect(dropdown).not.toBeInTheDocument();
	});

	it('renders with merchandising banners', async () => {
		mockClient.mockData.updateConfig({ search: 'merchandising' });

		searchConfig = { ...searchConfigDefault };
		searchConfig.id = uuidv4().split('-').join('');

		controller = new SearchController(searchConfig, {
			client: mockClient,
			store: new SearchStore(searchConfig, services),
			urlManager,
			eventManager: new EventManager(),
			profiler: new Profiler(),
			logger: new Logger(),
			tracker: new Tracker(globals),
		});

		await controller.search();

		const rendered = render(<SearchHorizontal controller={controller} />);

		const element = rendered.container.querySelector('.ss__search-horizontal');
		const banners = rendered.container.querySelectorAll('.ss__banner');
		const headerBanner = rendered.container.querySelector('.ss__banner--header');
		const leftBanner = rendered.container.querySelector('.ss__banner--left');
		const bannerBanner = rendered.container.querySelector('.ss__banner--banner');
		const footerBanner = rendered.container.querySelector('.ss__banner--footer');

		expect(element).toBeInTheDocument();
		expect(banners).toHaveLength(3);
		expect(headerBanner).toBeInTheDocument();
		expect(bannerBanner).toBeInTheDocument();
		expect(footerBanner).toBeInTheDocument();
		expect(leftBanner).not.toBeInTheDocument();

		mockClient.mockData.updateConfig({ search: 'default' });
	});

	it('can hide TopToolbar', async () => {
		const rendered = render(<SearchHorizontal controller={controller} hideTopToolbar />);
		const element = rendered.container.querySelector('.ss__search-horizontal')!;
		const topToolBar = rendered.container.querySelector('.ss__search-horizontal__content__toolbar--topToolBar');

		expect(element).toBeInTheDocument();
		expect(topToolBar).not.toBeInTheDocument();
	});

	it('can render MiddleToolbar', async () => {
		const theme: Theme = {
			components: {
				toolbar: {
					//middle toolbar is empty by default
					layout: ['SearchHeader'],
				},
			},
		};

		const rendered = render(<SearchHorizontal controller={controller} theme={theme} />);
		const element = rendered.container.querySelector('.ss__search-horizontal')!;
		const middleToolBar = rendered.container.querySelector('.ss__search-horizontal__content__toolbar--middle-toolbar');

		expect(element).toBeInTheDocument();
		expect(middleToolBar).toBeInTheDocument();
	});

	it('can hide MiddleToolbar', async () => {
		const theme: Theme = {
			components: {
				toolbar: {
					//middle toolbar is empty by default
					layout: ['SearchHeader'],
				},
			},
		};

		const rendered = render(<SearchHorizontal controller={controller} hideMiddleToolbar theme={theme} />);
		const element = rendered.container.querySelector('.ss__search-horizontal')!;
		const middleToolBar = rendered.container.querySelector('.ss__search-horizontal__content__toolbar--middle-toolbar');

		expect(element).toBeInTheDocument();
		expect(middleToolBar).not.toBeInTheDocument();
	});

	it('can hide BottomToolbar', async () => {
		const rendered = render(<SearchHorizontal controller={controller} hideBottomToolBar />);
		const element = rendered.container.querySelector('.ss__search-horizontal')!;
		const bottomToolBar = rendered.container.querySelector('.ss__search-horizontal__content__toolbar--bottomToolBar');

		expect(element).toBeInTheDocument();
		expect(bottomToolBar).not.toBeInTheDocument();
	});

	it('renders with custom resultComponent', () => {
		const customResultClass = 'customResult';
		const customResultComponent = (props: any) => {
			const { result } = props;
			return <div className={customResultClass}>{result.id}</div>;
		};

		const rendered = render(<SearchHorizontal controller={controller} resultComponent={customResultComponent} />);

		const element = rendered.container.querySelector('.ss__search-horizontal');
		const results = rendered.container.querySelectorAll(`.${customResultClass}`);

		expect(element).toBeInTheDocument();
		expect(results).toHaveLength(controller.store.results.length);
		results.forEach((result, idx) => {
			expect(result.textContent).toBe(controller.store.results[idx].id);
		});
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<SearchHorizontal controller={controller} className={className} />);

		const element = rendered.container.querySelector('.ss__search-horizontal');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<SearchHorizontal controller={controller} disableStyles />);

		const element = rendered.container.querySelector('.ss__search-horizontal');

		expect(element?.classList).toHaveLength(1);
	});

	it('is themeable with ThemeProvider', () => {
		const theme = {
			components: {
				searchHorizontal: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<SearchHorizontal controller={controller} />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__search-horizontal')!;
		expect(element).toHaveClass(theme.components.searchHorizontal.className);
	});

	it('is themeable with theme prop', () => {
		const theme = {
			components: {
				searchHorizontal: {
					className: 'classy',
				},
			},
		};
		const rendered = render(<SearchHorizontal controller={controller} theme={theme} />);
		const element = rendered.container.querySelector('.ss__search-horizontal')!;
		expect(element).toHaveClass(theme.components.searchHorizontal.className);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const theme = {
			components: {
				searchHorizontal: {
					className: 'notClassy',
				},
			},
		};

		const componentTheme = {
			components: {
				searchHorizontal: {
					className: 'classy',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={theme}>
				<SearchHorizontal controller={controller} theme={componentTheme} />
			</ThemeProvider>
		);

		const element = rendered.container.querySelector('.ss__search-horizontal')!;
		expect(element).toHaveClass(componentTheme.components.searchHorizontal.className);
		expect(element).not.toHaveClass(theme.components.searchHorizontal.className);
	});
});

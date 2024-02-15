import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';
import { v4 as uuidv4 } from 'uuid';
import { ContentType, SearchStore, SearchStoreConfig } from '@searchspring/snap-store-mobx';
import { SearchController, SearchControllerConfig } from '@searchspring/snap-controller';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { MockClient } from '@searchspring/snap-shared';
import { QueryStringTranslator, UrlManager, reactLinker } from '@searchspring/snap-url-manager';
import { HorizontalSearch } from './HorizontalSearch';
import userEvent from '@testing-library/user-event';

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

describe('HorizontalSearch Template Component', () => {
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
		const rendered = render(<HorizontalSearch controller={controller} />);
		const element = rendered.container.querySelector('.ss__horizontal-search');
		expect(element).toBeInTheDocument();
	});

	it('renders expected sub components', () => {
		const rendered = render(<HorizontalSearch controller={controller} />);
		const element = rendered.container.querySelector('.ss__horizontal-search')!;

		const searchHeader = rendered.container.querySelector('.ss__search-header');
		const horizontalFacets = rendered.container.querySelector('.ss__horizontal-facets');

		const results = rendered.container.querySelector('.ss__results');
		const noResults = rendered.container.querySelector('.ss__no-results');

		const topToolBar = rendered.container.querySelector('.ss__horizontal-search__content__toolbar--top-toolbar');
		const bottomToolBar = rendered.container.querySelector('.ss__horizontal-search__content__toolbar--bottom-toolbar');

		const toggleFiltersButton = rendered.container.querySelector('.ss__horizontal-search__sidebar-wrapper-toggle');
		const mobileSidebar = rendered.container.querySelector('.ss__mobile-sidebar__slideout');
		const dropdown = rendered.container.querySelector('.ss__horizontal-search__sidebar-wrapper-toggle');

		expect(element).toBeInTheDocument();
		expect(searchHeader).toBeInTheDocument();
		expect(horizontalFacets).toBeInTheDocument();
		expect(results).toBeInTheDocument();
		expect(noResults).not.toBeInTheDocument();
		expect(topToolBar).toBeInTheDocument();
		expect(bottomToolBar).toBeInTheDocument();
		expect(toggleFiltersButton).not.toBeInTheDocument();
		expect(mobileSidebar).not.toBeInTheDocument();
		expect(dropdown).not.toBeInTheDocument();
	});

	it('renders with merchandising banners', async () => {
		mockClient.mockData.updateConfig({ search: 'merchandising' });
		await controller.search();

		const rendered = render(<HorizontalSearch controller={controller} />);

		const element = rendered.container.querySelector('.ss__horizontal-search');
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
		expect(leftBanner).not.toBeInTheDocument(); // left banner is not supported in horizontal search

		mockClient.mockData.updateConfig({ search: 'default' });
	});

	it('can hide hideSearchHeader', async () => {
		mockClient.mockData.updateConfig({ search: 'merchandising' });
		await controller.search();

		const rendered = render(<HorizontalSearch controller={controller} hideSearchHeader />);
		const element = rendered.container.querySelector('.ss__horizontal-search')!;
		const header = rendered.container.querySelector('.ss__search-header');

		expect(element).toBeInTheDocument();
		expect(header).not.toBeInTheDocument();
	});

	it('can hide toptoolbar', async () => {
		mockClient.mockData.updateConfig({ search: 'merchandising' });
		await controller.search();

		const rendered = render(<HorizontalSearch controller={controller} hideTopToolbar />);
		const element = rendered.container.querySelector('.ss__horizontal-search')!;
		const topToolBar = rendered.container.querySelector('.ss__horizontal-search__content__toolbar--topToolBar');

		expect(element).toBeInTheDocument();
		expect(topToolBar).not.toBeInTheDocument();
	});

	it('can hide bottomToolbar', async () => {
		mockClient.mockData.updateConfig({ search: 'merchandising' });
		await controller.search();

		const rendered = render(<HorizontalSearch controller={controller} hideBottomToolBar />);
		const element = rendered.container.querySelector('.ss__horizontal-search')!;
		const bottomToolBar = rendered.container.querySelector('.ss__horizontal-search__content__toolbar--bottomToolBar');

		expect(element).toBeInTheDocument();
		expect(bottomToolBar).not.toBeInTheDocument();
	});

	it('can hide all merchandising banners', async () => {
		mockClient.mockData.updateConfig({ search: 'merchandising' });
		await controller.search();

		const rendered = render(<HorizontalSearch controller={controller} hideMerchandisingBanners />);

		const element = rendered.container.querySelector('.ss__horizontal-search');
		const banners = rendered.container.querySelectorAll('.ss__banner');

		expect(element).toBeInTheDocument();
		expect(banners).toHaveLength(0);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<HorizontalSearch controller={controller} className={className} />);

		const element = rendered.container.querySelector('.ss__horizontal-search');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<HorizontalSearch controller={controller} disableStyles />);

		const element = rendered.container.querySelector('.ss__horizontal-search');

		expect(element?.classList).toHaveLength(1);
	});

	it('is themeable with ThemeProvider', () => {
		const theme = {
			components: {
				horizontalSearch: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<HorizontalSearch controller={controller} />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__horizontal-search')!;
		expect(element).toHaveClass(theme.components.horizontalSearch.className);
	});

	it('is themeable with theme prop', () => {
		const theme = {
			components: {
				horizontalSearch: {
					className: 'classy',
				},
			},
		};
		const rendered = render(<HorizontalSearch controller={controller} theme={theme} />);
		const element = rendered.container.querySelector('.ss__horizontal-search')!;
		expect(element).toHaveClass(theme.components.horizontalSearch.className);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const theme = {
			components: {
				horizontalSearch: {
					className: 'notClassy',
				},
			},
		};

		const componentTheme = {
			components: {
				horizontalSearch: {
					className: 'classy',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={theme}>
				<HorizontalSearch controller={controller} theme={componentTheme} />
			</ThemeProvider>
		);

		const element = rendered.container.querySelector('.ss__horizontal-search')!;
		expect(element).toHaveClass(componentTheme.components.horizontalSearch.className);
		expect(element).not.toHaveClass(theme.components.horizontalSearch.className);
	});
});

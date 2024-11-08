import { h } from 'preact';
import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';
import { Toolbar } from './Toolbar';
import { v4 as uuidv4 } from 'uuid';
import { SearchStore, SearchStoreConfig } from '@searchspring/snap-store-mobx';
import { SearchController, SearchControllerConfig } from '@searchspring/snap-controller';
import { EventManager } from '@searchspring/snap-event-manager';
import { Profiler } from '@searchspring/snap-profiler';
import { Logger } from '@searchspring/snap-logger';
import { Tracker } from '@searchspring/snap-tracker';
import { MockClient } from '@searchspring/snap-shared';
import { QueryStringTranslator, UrlManager, reactLinker } from '@searchspring/snap-url-manager';

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
mockClient.mockData.updateConfig({ search: 'filtered' });

const TopSlotComponent = () => <div className="top-slot">topSlot</div>;
const BottomSlotComponent = () => <div className="bottom-slot">bottomSlot</div>;

describe('Results Component', () => {
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
		const rendered = render(<Toolbar controller={controller} />);
		const element = rendered.container.querySelector('.ss__toolbar')!;
		expect(element).toBeInTheDocument();
	});

	it('renders expected sub-components', () => {
		const rendered = render(<Toolbar controller={controller} />);
		const filterSummaryElement = rendered.container.querySelector('.ss__toolbar__filter-summary');
		// TODO: Requires theme store
		// const layoutSelectorElement = rendered.container.querySelector('.ss__toolbar__layout-selector');
		const paginationElement = rendered.container.querySelector('.ss__toolbar__pagination');
		const paginationInfoElement = rendered.container.querySelector('.ss__toolbar__pagination-info');
		const mobileSidebarElement = rendered.container.querySelector('.ss__toolbar__mobile-sidebar');
		const sortByElement = rendered.container.querySelector('.ss__toolbar__sort-by');
		const perPageElement = rendered.container.querySelector('.ss__toolbar__per-page');

		expect(filterSummaryElement).toBeInTheDocument();
		// expect(layoutSelectorElement).toBeInTheDocument();
		expect(paginationElement).toBeInTheDocument();
		expect(paginationInfoElement).toBeInTheDocument();
		expect(mobileSidebarElement).toBeInTheDocument();
		expect(sortByElement).toBeInTheDocument();
		expect(perPageElement).toBeInTheDocument();
	});

	it('can hide filterSummary', () => {
		const rendered = render(<Toolbar controller={controller} hideFilterSummary />);
		const filterSummaryElement = rendered.container.querySelector('.ss__toolbar__filter-summary');
		const paginationElement = rendered.container.querySelector('.ss__toolbar__pagination');
		const sortByElement = rendered.container.querySelector('.ss__toolbar__sort-by');
		const perPageElement = rendered.container.querySelector('.ss__toolbar__per-page');

		expect(filterSummaryElement).not.toBeInTheDocument();
		expect(paginationElement).toBeInTheDocument();
		expect(sortByElement).toBeInTheDocument();
		expect(perPageElement).toBeInTheDocument();
	});

	it('can hide pagination', () => {
		const rendered = render(<Toolbar controller={controller} hidePagination />);
		const filterSummaryElement = rendered.container.querySelector('.ss__toolbar__filter-summary');
		const paginationElement = rendered.container.querySelector('.ss__toolbar__pagination');
		const sortByElement = rendered.container.querySelector('.ss__toolbar__sort-by');
		const perPageElement = rendered.container.querySelector('.ss__toolbar__per-page');

		expect(filterSummaryElement).toBeInTheDocument();
		expect(paginationElement).not.toBeInTheDocument();
		expect(sortByElement).toBeInTheDocument();
		expect(perPageElement).toBeInTheDocument();
	});

	it('can hide paginationInfo', () => {
		const rendered = render(<Toolbar controller={controller} hidePaginationInfo />);
		const paginationInfoElement = rendered.container.querySelector('.ss__toolbar__pagination-info');

		expect(paginationInfoElement).not.toBeInTheDocument();
	});

	it('can hide mobileSidebar', () => {
		const rendered = render(<Toolbar controller={controller} hideMobileSidebar />);
		const mobileSidebarElement = rendered.container.querySelector('.ss__toolbar__mobile-sidebar');

		expect(mobileSidebarElement).not.toBeInTheDocument();
	});

	it('can provide topSlot', () => {
		const rendered = render(<Toolbar controller={controller} topSlot={<TopSlotComponent />} />);
		const topSlotElement = rendered.container.querySelector('.ss__toolbar__slot--top .top-slot');

		expect(topSlotElement).toBeInTheDocument();
		expect(topSlotElement).toHaveTextContent('topSlot');
	});

	it('can provide bottomSlot', () => {
		const rendered = render(<Toolbar controller={controller} bottomSlot={<BottomSlotComponent />} />);
		const bottomSlotElement = rendered.container.querySelector('.ss__toolbar__slot--bottom .bottom-slot');

		expect(bottomSlotElement).toBeInTheDocument();
		expect(bottomSlotElement).toHaveTextContent('bottomSlot');
	});

	it('can hide sortBy', () => {
		const rendered = render(<Toolbar controller={controller} hideSortBy />);
		const filterSummaryElement = rendered.container.querySelector('.ss__toolbar__filter-summary');
		const paginationElement = rendered.container.querySelector('.ss__toolbar__pagination');
		const sortByElement = rendered.container.querySelector('.ss__toolbar__sort-by');
		const perPageElement = rendered.container.querySelector('.ss__toolbar__per-page');

		expect(filterSummaryElement).toBeInTheDocument();
		expect(paginationElement).toBeInTheDocument();
		expect(sortByElement).not.toBeInTheDocument();
		expect(perPageElement).toBeInTheDocument();
	});

	it('can hide perPage', () => {
		const rendered = render(<Toolbar controller={controller} hidePerPage />);
		const filterSummaryElement = rendered.container.querySelector('.ss__toolbar__filter-summary');
		const paginationElement = rendered.container.querySelector('.ss__toolbar__pagination');
		const sortByElement = rendered.container.querySelector('.ss__toolbar__sort-by');
		const perPageElement = rendered.container.querySelector('.ss__toolbar__per-page');

		expect(filterSummaryElement).toBeInTheDocument();
		expect(paginationElement).toBeInTheDocument();
		expect(sortByElement).toBeInTheDocument();
		expect(perPageElement).not.toBeInTheDocument();
	});

	it('can hide everything', () => {
		const rendered = render(
			<Toolbar
				controller={controller}
				topSlot={<TopSlotComponent />}
				bottomSlot={<BottomSlotComponent />}
				hidePerPage
				hidePagination
				hidePaginationInfo
				hideMobileSidebar
				hideSortBy
				hideFilterSummary
				hideTopSlot
				hideBottomSlot
				hideLayoutSelector
			/>
		);
		const filterSummaryElement = rendered.container.querySelector('.ss__toolbar__filter-summary');
		// TODO: Requires theme store
		// const layoutSelectorElement = rendered.container.querySelector('.ss__toolbar__layout-selector');
		const paginationElement = rendered.container.querySelector('.ss__toolbar__pagination');
		const paginationInfoElement = rendered.container.querySelector('.ss__toolbar__pagination-info');
		const mobileSidebarElement = rendered.container.querySelector('.ss__toolbar__mobile-sidebar');
		const sortByElement = rendered.container.querySelector('.ss__toolbar__sort-by');
		const perPageElement = rendered.container.querySelector('.ss__toolbar__per-page');
		const topSlotElement = rendered.container.querySelector('.top-slot');
		const bottomSlotElement = rendered.container.querySelector('.bottom-slot');

		expect(filterSummaryElement).not.toBeInTheDocument();
		// expect(layoutSelectorElement).toBeInTheDocument();
		expect(paginationElement).not.toBeInTheDocument();
		expect(paginationInfoElement).not.toBeInTheDocument();
		expect(mobileSidebarElement).not.toBeInTheDocument();
		expect(sortByElement).not.toBeInTheDocument();
		expect(perPageElement).not.toBeInTheDocument();
		expect(topSlotElement).not.toBeInTheDocument();
		expect(bottomSlotElement).not.toBeInTheDocument();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Toolbar controller={controller} className={className} />);

		const element = rendered.container.querySelector('.ss__toolbar');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<Toolbar controller={controller} disableStyles />);

		const element = rendered.container.querySelector('.ss__toolbar');

		expect(element?.classList).toHaveLength(1);
	});

	it('is themeable with ThemeProvider', () => {
		const theme = {
			components: {
				toolbar: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<Toolbar controller={controller} />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__toolbar')!;
		expect(element).toHaveClass(theme.components.toolbar.className);
	});

	it('is themeable with theme prop', () => {
		const theme = {
			components: {
				toolbar: {
					className: 'classy',
				},
			},
		};
		const rendered = render(<Toolbar controller={controller} theme={theme} />);
		const element = rendered.container.querySelector('.ss__toolbar')!;
		expect(element).toHaveClass(theme.components.toolbar.className);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const theme = {
			components: {
				toolbar: {
					className: 'notClassy',
				},
			},
		};

		const componentTheme = {
			components: {
				toolbar: {
					className: 'classy',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={theme}>
				<Toolbar controller={controller} theme={componentTheme} />
			</ThemeProvider>
		);

		const element = rendered.container.querySelector('.ss__toolbar')!;
		expect(element).toHaveClass(componentTheme.components.toolbar.className);
		expect(element).not.toHaveClass(theme.components.toolbar.className);
	});
});

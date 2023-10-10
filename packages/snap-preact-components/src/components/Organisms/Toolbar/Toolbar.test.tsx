import { h } from 'preact';
import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';
import themes from '../../../themes';
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

	Object.keys(themes || {}).forEach((themeName) => {
		it(`uses ${themeName} theme`, () => {
			const theme = themes[themeName as keyof typeof themes];
			const rendered = render(<Toolbar theme={theme} controller={controller} />);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	it('renders', () => {
		const rendered = render(<Toolbar controller={controller} />);
		const element = rendered.container.querySelector('.ss__toolbar')!;
		expect(element).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders expected sub-components', () => {
		const rendered = render(<Toolbar controller={controller} />);
		const filterSummaryElement = rendered.container.querySelector('.ss__toolbar__filter-summary');
		const paginationElement = rendered.container.querySelector('.ss__toolbar__pagination');
		const sortByElement = rendered.container.querySelector('.ss__toolbar__sort-by');
		const perPageElement = rendered.container.querySelector('.ss__toolbar__per-page');

		expect(filterSummaryElement).toBeInTheDocument();
		expect(paginationElement).toBeInTheDocument();
		expect(sortByElement).toBeInTheDocument();
		expect(perPageElement).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can hide filterSummary', () => {
		const rendered = render(<Toolbar controller={controller} hidefilterSummary />);
		const filterSummaryElement = rendered.container.querySelector('.ss__toolbar__filter-summary');
		const paginationElement = rendered.container.querySelector('.ss__toolbar__pagination');
		const sortByElement = rendered.container.querySelector('.ss__toolbar__sort-by');
		const perPageElement = rendered.container.querySelector('.ss__toolbar__per-page');

		expect(filterSummaryElement).not.toBeInTheDocument();
		expect(paginationElement).toBeInTheDocument();
		expect(sortByElement).toBeInTheDocument();
		expect(perPageElement).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
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
		expect(rendered.asFragment()).toMatchSnapshot();
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
		expect(rendered.asFragment()).toMatchSnapshot();
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
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can hide everything', () => {
		const rendered = render(<Toolbar controller={controller} hidePerPage hidePagination hideSortBy hidefilterSummary />);
		const filterSummaryElement = rendered.container.querySelector('.ss__toolbar__filter-summary');
		const paginationElement = rendered.container.querySelector('.ss__toolbar__pagination');
		const sortByElement = rendered.container.querySelector('.ss__toolbar__sort-by');
		const perPageElement = rendered.container.querySelector('.ss__toolbar__per-page');

		const wrapper = rendered.container.querySelector('.ss__toolbar')!;
		expect(wrapper).toBeInTheDocument();
		expect(filterSummaryElement).not.toBeInTheDocument();
		expect(paginationElement).not.toBeInTheDocument();
		expect(sortByElement).not.toBeInTheDocument();
		expect(perPageElement).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Toolbar controller={controller} className={className} />);

		const element = rendered.container.querySelector('.ss__toolbar');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can disable styles', () => {
		const rendered = render(<Toolbar controller={controller} disableStyles />);

		const element = rendered.container.querySelector('.ss__toolbar');

		expect(element?.classList).toHaveLength(1);
		expect(rendered.asFragment()).toMatchSnapshot();
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
		expect(rendered.asFragment()).toMatchSnapshot();
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
		expect(rendered.asFragment()).toMatchSnapshot();
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
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});

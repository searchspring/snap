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
mockClient.mockData.updateConfig({ search: 'filtered' });

describe('Toolbar Component', () => {
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

	it('renders expected default sub-components', () => {
		const rendered = render(<Toolbar controller={controller} />);
		const filterSummaryElement = rendered.container.querySelector('.ss__filter-summary');
		const paginationElement = rendered.container.querySelector('.ss__pagination');
		const paginationInfoElement = rendered.container.querySelector('.ss__pagination-info');
		const mobileSidebarElement = rendered.container.querySelector('.ss__mobile-sidebar');
		const sortByElement = rendered.container.querySelector('.ss__sortby');
		const perPageElement = rendered.container.querySelector('.ss__per-page');

		const toolbar = rendered.container.querySelector('.ss__toolbar')!;
		expect(toolbar).toBeInTheDocument();
		expect(filterSummaryElement).toBeInTheDocument();
		expect(paginationElement).toBeInTheDocument();
		expect(paginationInfoElement).toBeInTheDocument();
		expect(mobileSidebarElement).toBeInTheDocument();
		expect(sortByElement).toBeInTheDocument();
		expect(perPageElement).toBeInTheDocument();
	});

	it('can pass custom layout', () => {
		const rendered = render(<Toolbar controller={controller} layout={['perPage', 'pagination']} />);
		const filterSummaryElement = rendered.container.querySelector('.ss__filter-summary');
		const paginationElement = rendered.container.querySelector('.ss__pagination');
		const paginationInfoElement = rendered.container.querySelector('.ss__pagination-info');
		const mobileSidebarElement = rendered.container.querySelector('.ss__mobile-sidebar');
		const sortByElement = rendered.container.querySelector('.ss__sortby');
		const perPageElement = rendered.container.querySelector('.ss__per-page');

		const toolbar = rendered.container.querySelector('.ss__toolbar')!;
		expect(toolbar).toBeInTheDocument();
		expect(filterSummaryElement).not.toBeInTheDocument();
		expect(paginationInfoElement).not.toBeInTheDocument();
		expect(mobileSidebarElement).not.toBeInTheDocument();
		expect(sortByElement).not.toBeInTheDocument();

		expect(perPageElement).toBeInTheDocument();
		expect(paginationElement).toBeInTheDocument();
	});

	it('arrays equal rows', () => {
		const rendered = render(<Toolbar controller={controller} layout={['perPage', 'pagination', ['sortBy'], ['paginationInfo', 'filterSummary']]} />);

		const sortByElement = rendered.container.querySelector('.ss__layout__row.ss__layout__row--0 .ss__sortby');

		const filterSummaryElement = rendered.container.querySelector('.ss__layout__row.ss__layout__row--1 .ss__filter-summary');
		const paginationInfoElement = rendered.container.querySelector('.ss__layout__row.ss__layout__row--1 .ss__pagination-info');

		const mobileSidebarElement = rendered.container.querySelector('.ss__mobile-sidebar');
		const perPageElement = rendered.container.querySelector('.ss__per-page');
		const paginationElement = rendered.container.querySelector('.ss__pagination');

		const toolbar = rendered.container.querySelector('.ss__toolbar')!;

		const row = rendered.container.querySelectorAll('.ss__layout__row');

		expect(row).toHaveLength(2);
		expect(row[0].children).toHaveLength(1);
		expect(row[0].classList).toContain('ss__layout__row--0');

		expect(row[1].children).toHaveLength(2);
		expect(row[1].classList).toContain('ss__layout__row--1');

		expect(toolbar).toBeInTheDocument();
		expect(filterSummaryElement).toBeInTheDocument();
		expect(paginationInfoElement).toBeInTheDocument();
		expect(mobileSidebarElement).not.toBeInTheDocument();

		expect(sortByElement).toBeInTheDocument();
		expect(perPageElement).toBeInTheDocument();
		expect(paginationElement).toBeInTheDocument();
	});
	it('can hide set custom toggleSideBarButton', async () => {
		const func = jest.fn();
		const button = {
			content: 'Toggle Sidebar',
			onClick: func,
		};

		const rendered = render(<Toolbar controller={controller} toggleSideBarButton={button} layout={['button.sidebar-toggle']} />);
		const filterSummaryElement = rendered.container.querySelector('.ss__filter-summary');
		const paginationElement = rendered.container.querySelector('.ss__pagination');
		const paginationInfoElement = rendered.container.querySelector('.ss__pagination-info');
		const mobileSidebarElement = rendered.container.querySelector('.ss__mobile-sidebar');
		const sortByElement = rendered.container.querySelector('.ss__sortby');
		const perPageElement = rendered.container.querySelector('.ss__per-page');

		const toggleButtonElement = rendered.container.querySelector('.ss__button--sidebar-toggle-button-wrapper .ss__button');

		const toolbar = rendered.container.querySelector('.ss__toolbar')!;
		expect(toolbar).toBeInTheDocument();
		expect(filterSummaryElement).not.toBeInTheDocument();
		expect(paginationElement).not.toBeInTheDocument();
		expect(paginationInfoElement).not.toBeInTheDocument();
		expect(mobileSidebarElement).not.toBeInTheDocument();
		expect(sortByElement).not.toBeInTheDocument();
		expect(perPageElement).not.toBeInTheDocument();

		expect(toggleButtonElement).toBeInTheDocument();
		expect(func).not.toHaveBeenCalled();

		expect(toggleButtonElement).toHaveTextContent(button.content);
		await userEvent.click(toggleButtonElement!);
		expect(func).toHaveBeenCalled();
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

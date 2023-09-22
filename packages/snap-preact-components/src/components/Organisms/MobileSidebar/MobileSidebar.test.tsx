import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import { MobileSidebar } from './MobileSidebar';
import { ThemeProvider } from '../../../providers';
import themes from '../../../themes';
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

describe('MobileSidebar Component', () => {
	const mockClient = new MockClient(globals, {});
	mockClient.mockData.updateConfig({ search: 'filteredRangeBucket' });

	beforeEach(async () => {
		//override matchmedia to always return true
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query) => ({
				matches: true, // always set as true
				media: query,
				onchange: null,
				addListener: jest.fn(), // Deprecated
				removeListener: jest.fn(), // Deprecated
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});

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
			const rendered = render(<MobileSidebar theme={theme} controller={controller} />);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	it('renders', () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const element = rendered.container.querySelector('.ss__mobile-sidebar');
		expect(element).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('does not render unless button is clicked', async () => {
		const rendered = render(<MobileSidebar controller={controller} />);

		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		let title = rendered.container.querySelector('.ss__mobile-sidebar__header__title');
		let summary = rendered.container.querySelector('.ss__filter-summary');
		let sortby = rendered.container.querySelector('.ss__sortby__select');
		let perpage = rendered.container.querySelector('.ss__perpage__select');
		let facets = rendered.container.querySelector('.ss__facets');

		expect(slideoutButton).toBeInTheDocument();

		expect(title).not.toBeInTheDocument();
		expect(summary).not.toBeInTheDocument();
		expect(sortby).not.toBeInTheDocument();
		expect(perpage).not.toBeInTheDocument();
		expect(facets).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();

		userEvent.click(slideoutButton!);

		await waitFor(() => {
			title = rendered.container.querySelector('.ss__mobile-sidebar__header__title');
			summary = rendered.container.querySelector('.ss__filter-summary');
			sortby = rendered.container.querySelector('.ss__sortby__select');
			perpage = rendered.container.querySelector('.ss__perpage__select');
			facets = rendered.container.querySelector('.ss__facets');
			expect(title).toBeInTheDocument();
			expect(summary).toBeInTheDocument();
			expect(sortby).toBeInTheDocument();
			expect(perpage).toBeInTheDocument();
			expect(facets).toBeInTheDocument();
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('does not render unless media query matches', async () => {
		//override matchmedia to always return false
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query) => ({
				matches: false, // set it to false
				media: query,
				onchange: null,
				addListener: jest.fn(), // Deprecated
				removeListener: jest.fn(), // Deprecated
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});

		const rendered = render(<MobileSidebar controller={controller} />);

		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		let slideoutContent = rendered.container.querySelector('.ss__mobile-sidebar__content');

		expect(slideoutButton).not.toBeInTheDocument();
		expect(slideoutContent).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can change slideout open button text', async () => {
		const text = 'click me';
		const rendered = render(<MobileSidebar controller={controller} openButtonText={text} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(slideoutButton?.innerHTML).toBe(text);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has expected default slideout open button text', async () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(slideoutButton?.innerHTML).toBe('Filters');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has expected default clear button text', async () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__footer__clear-button');
			expect(element).toHaveTextContent('Clear All');
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can use the apply button', async () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(async () => {
			const applyButton = rendered.container.querySelector('.ss__mobile-sidebar__footer__apply-button');

			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(rendered.asFragment()).toMatchSnapshot();

			userEvent.click(applyButton!);

			await waitFor(() => {
				const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
				expect(element).not.toBeInTheDocument();
			});
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	it('can use the close button', async () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(async () => {
			const closeButton = rendered.container.querySelector('.ss__mobile-sidebar__header__close-button');
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(rendered.asFragment()).toMatchSnapshot();

			userEvent.click(closeButton!);

			await waitFor(() => {
				const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
				expect(element).not.toBeInTheDocument();
			});
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	it('can hide clear button', async () => {
		const rendered = render(<MobileSidebar controller={controller} hideClearButton={true} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__footer__clear-button');
			expect(element).not.toBeInTheDocument();
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can hide close button', async () => {
		const rendered = render(<MobileSidebar controller={controller} hideCloseButton={true} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__header__close-button');
			expect(element).not.toBeInTheDocument();
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has expected default close button icon', async () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const iconElem = rendered.container.querySelector(
				`.ss__mobile-sidebar__header .ss__mobile-sidebar__header__close-button .ss__icon--close-thin`
			);
			expect(iconElem).toBeInTheDocument();
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can change close button', async () => {
		const icon = 'cog';
		const title = 'title text';
		const rendered = render(<MobileSidebar controller={controller} closeButtonText={title} closeButtonIcon={icon} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const elem = rendered.container.querySelector(`.ss__mobile-sidebar__header__close-button`);
			const iconElem = rendered.container.querySelector(`.ss__mobile-sidebar__header .ss__mobile-sidebar__header__close-button .ss__icon--${icon}`);
			expect(elem).toHaveTextContent(title);
			expect(iconElem).toBeInTheDocument();
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can change open button', async () => {
		const icon = 'cog';
		const title = 'title text';
		const rendered = render(<MobileSidebar controller={controller} openButtonText={title} openButtonIcon={icon} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');

		const iconElem = rendered.container.querySelector(`.ss__mobile-sidebar__slideout__button .ss__icon--${icon}`);
		expect(slideoutButton).toHaveTextContent(title);
		expect(iconElem).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can change apply button', async () => {
		const text = 'some text';
		const icon = 'cog';
		const rendered = render(<MobileSidebar controller={controller} applyButtonIcon={icon} applyButtonText={text} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const applyButton = rendered.container.querySelector('.ss__mobile-sidebar__footer__apply-button');
			const iconElem = rendered.container.querySelector(`.ss__mobile-sidebar__footer__apply-button .ss__icon--${icon}`);

			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(applyButton).toHaveTextContent(text);
			expect(iconElem).toBeInTheDocument();
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can change clear button text', async () => {
		const text = 'click me';
		const icon = 'cog';

		const rendered = render(<MobileSidebar controller={controller} clearButtonIcon={icon} clearButtonText={text} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__footer__clear-button');
			const iconElem = rendered.container.querySelector(`.ss__mobile-sidebar__footer__clear-button .ss__icon--${icon}`);
			expect(iconElem).toBeInTheDocument();
			expect(element).toHaveTextContent(text);
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('clear button clears filters', async () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(async () => {
			const filterSummaryElement = rendered.container.querySelector('.ss__filter-summary');
			expect(filterSummaryElement).toBeInTheDocument();
		});
		expect(rendered.asFragment()).toMatchSnapshot();

		const clearButton = rendered.container.querySelector('.ss__mobile-sidebar__footer__clear-button');

		mockClient.mockData.updateConfig({ search: 'default' });

		userEvent.click(clearButton!);

		await controller.search();

		await waitFor(() => {
			expect(controller.store.filters.length).toBe(0);
			const filterSummaryElement = rendered.container.querySelector('.ss__filter-summary');
			expect(filterSummaryElement).not.toBeInTheDocument();
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can hideHeader', async () => {
		const rendered = render(<MobileSidebar controller={controller} hideHeader={true} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			const title = rendered.container.querySelector('.ss__mobile-sidebar__header__title');
			expect(element).toBeInTheDocument();
			expect(title).not.toBeInTheDocument();
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can hideFooter', async () => {
		const rendered = render(<MobileSidebar controller={controller} hideFooter={true} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			const footer = rendered.container.querySelector('.ss__mobile-sidebar__footer');
			expect(element).toBeInTheDocument();
			expect(footer).not.toBeInTheDocument();
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has expected default titleText', async () => {
		const text = 'Filter Options';
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const title = rendered.container.querySelector('.ss__mobile-sidebar__header__title');
			expect(title?.innerHTML).toBe(text);
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can change titleText', async () => {
		const text = 'title text';
		const rendered = render(<MobileSidebar controller={controller} titleText={text} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const title = rendered.container.querySelector('.ss__mobile-sidebar__header__title');
			expect(title?.innerHTML).toBe(text);
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can hide hideFacets', async () => {
		const rendered = render(<MobileSidebar controller={controller} hideFacets={true} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const facets = rendered.container.querySelector('.ss__facets');
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(facets).not.toBeInTheDocument();
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can hide perpage', async () => {
		const rendered = render(<MobileSidebar controller={controller} hidePerPage={true} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const perpage = rendered.container.querySelector('.ss__perpage__select');
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(perpage).not.toBeInTheDocument();
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can hide hideSortBy', async () => {
		const rendered = render(<MobileSidebar controller={controller} hideSortBy={true} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const sortby = rendered.container.querySelector('.ss__sortby__select');
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(sortby).not.toBeInTheDocument();
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can hide FilterSummary', async () => {
		const rendered = render(<MobileSidebar controller={controller} hideFilterSummary={true} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const summary = rendered.container.querySelector('.ss__filter-summary');
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(summary).not.toBeInTheDocument();
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can hide hideApplyButton', async () => {
		const rendered = render(<MobileSidebar controller={controller} hideApplyButton={true} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const applyButton = rendered.container.querySelector('.ss__mobile-sidebar__footer__apply-button');
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(applyButton).not.toBeInTheDocument();
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has expected default apply button text', async () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(rendered.asFragment()).toMatchSnapshot();
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const applyButton = rendered.container.querySelector('.ss__mobile-sidebar__footer__apply-button');
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(applyButton).toHaveTextContent('Apply');
		});
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<MobileSidebar controller={controller} className={className} />);
		const element = rendered.container.querySelector('.ss__mobile-sidebar');
		expect(element).toHaveClass(className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('disables styles', () => {
		const rendered = render(<MobileSidebar controller={controller} disableStyles />);
		const element = rendered.container.querySelector('.ss__mobile-sidebar');
		expect(element?.classList).toHaveLength(1);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	describe('Sidebar theming works', () => {
		it('is themeable with ThemeProvider', () => {
			const globalTheme = {
				components: {
					mobileSidebar: {
						className: 'classy',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<MobileSidebar controller={controller} />
				</ThemeProvider>
			);
			const element = rendered.container.querySelector('.ss__mobile-sidebar');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(globalTheme.components.mobileSidebar.className);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('is themeable with theme prop', () => {
			const propTheme = {
				components: {
					mobileSidebar: {
						className: 'classy',
					},
				},
			};
			const rendered = render(<MobileSidebar controller={controller} theme={propTheme} />);
			const element = rendered.container.querySelector('.ss__mobile-sidebar');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.mobileSidebar.className);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('is theme prop overrides ThemeProvider', () => {
			const globalTheme = {
				components: {
					mobileSidebar: {
						className: 'not classy',
					},
				},
			};
			const propTheme = {
				components: {
					mobileSidebar: {
						className: 'classy',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<MobileSidebar controller={controller} theme={propTheme} />
				</ThemeProvider>
			);

			const element = rendered.container.querySelector('.ss__mobile-sidebar');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.mobileSidebar.className);
			expect(element).not.toHaveClass(globalTheme.components.mobileSidebar.className);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});
});

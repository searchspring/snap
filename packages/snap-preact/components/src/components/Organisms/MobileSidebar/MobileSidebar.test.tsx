import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import { MobileSidebar } from './MobileSidebar';
import { ThemeProvider } from '../../../providers';
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
mockClient.mockData.updateConfig({ search: 'filteredRangeBucket' });

describe('MobileSidebar Component', () => {
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

	it('renders', () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const element = rendered.container.querySelector('.ss__mobile-sidebar');
		expect(element).toBeInTheDocument();
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

		userEvent.click(slideoutButton!);

		await waitFor(() => {
			title = rendered.container.querySelector('.ss__mobile-sidebar__header__title');
			summary = rendered.container.querySelector('.ss__filter-summary');
			sortby = rendered.container.querySelector('.ss__sortby__select');
			perpage = rendered.container.querySelector('.ss__per-page__select');
			facets = rendered.container.querySelector('.ss__facets');
			expect(title).toBeInTheDocument();
			expect(summary).toBeInTheDocument();
			expect(sortby).toBeInTheDocument();
			expect(perpage).toBeInTheDocument();
			expect(facets).toBeInTheDocument();
		});
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
	});

	it('can change slideout open button text', async () => {
		const text = 'click me';
		const rendered = render(<MobileSidebar controller={controller} openButtonText={text} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(slideoutButton?.textContent).toBe(text);
	});

	it('has expected default slideout open button text', async () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		expect(slideoutButton?.textContent).toBe('Filters');
	});

	it('has expected default clear button text', async () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__footer__clear-button');
			expect(element).toHaveTextContent('Clear All');
		});
	});

	it('can use the apply button', async () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(async () => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
		});

		const applyButton = rendered.container.querySelector('.ss__mobile-sidebar__footer__apply-button');
		userEvent.click(applyButton!);

		await waitFor(() => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).not.toBeInTheDocument();
		});
	});

	it('can use the close button', async () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(async () => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
		});

		const closeButton = rendered.container.querySelector('.ss__mobile-sidebar__header__close-button');
		userEvent.click(closeButton!);

		await waitFor(() => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).not.toBeInTheDocument();
		});
	});

	it('can hide clear button', async () => {
		const rendered = render(<MobileSidebar controller={controller} hideClearButton={true} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__footer__clear-button');
			expect(element).not.toBeInTheDocument();
		});
	});

	it('can hide close button', async () => {
		const rendered = render(<MobileSidebar controller={controller} hideCloseButton={true} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__header__close-button');
			expect(element).not.toBeInTheDocument();
		});
	});

	it('has expected default close button icon', async () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const iconElem = rendered.container.querySelector(
				`.ss__mobile-sidebar__header .ss__mobile-sidebar__header__close-button .ss__icon--close-thin`
			);
			expect(iconElem).toBeInTheDocument();
		});
	});

	it('can change close button', async () => {
		const icon = 'cog';
		const title = 'title text';
		const rendered = render(<MobileSidebar controller={controller} closeButtonText={title} closeButtonIcon={icon} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const elem = rendered.container.querySelector(`.ss__mobile-sidebar__header__close-button`);
			const iconElem = rendered.container.querySelector(`.ss__mobile-sidebar__header .ss__mobile-sidebar__header__close-button .ss__icon--${icon}`);
			expect(elem).toHaveTextContent(title);
			expect(iconElem).toBeInTheDocument();
		});
	});

	it('can hide the close button text', async () => {
		const icon = 'cog';
		const title = 'title text';
		const lang = {
			closeButtonText: {
				value: 'lang text',
			},
		};
		const rendered = render(
			<MobileSidebar lang={lang} hideCloseButtonText={true} controller={controller} closeButtonText={title} closeButtonIcon={icon} />
		);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const elem = rendered.container.querySelector(`.ss__mobile-sidebar__header__close-button`);
			const iconElem = rendered.container.querySelector(`.ss__mobile-sidebar__header .ss__mobile-sidebar__header__close-button .ss__icon--${icon}`);
			expect(elem).not.toHaveTextContent(title);
			expect(elem).not.toHaveTextContent(lang.closeButtonText.value);
			expect(iconElem).toBeInTheDocument();
		});
	});

	it('can change open button', async () => {
		const icon = 'cog';
		const title = 'title text';
		const rendered = render(<MobileSidebar controller={controller} openButtonText={title} openButtonIcon={icon} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');

		const iconElem = rendered.container.querySelector(`.ss__mobile-sidebar__slideout__button .ss__icon--${icon}`);
		expect(slideoutButton).toHaveTextContent(title);
		expect(iconElem).toBeInTheDocument();
	});

	it('can hide the open text', async () => {
		const icon = 'cog';
		const title = 'title text';
		const lang = {
			openButtonText: {
				value: 'lang text',
			},
		};
		const rendered = render(
			<MobileSidebar lang={lang} controller={controller} hideOpenButtonText={true} openButtonText={title} openButtonIcon={icon} />
		);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');

		const iconElem = rendered.container.querySelector(`.ss__mobile-sidebar__slideout__button .ss__icon--${icon}`);
		expect(slideoutButton).not.toHaveTextContent(title);
		expect(slideoutButton).not.toHaveTextContent(lang.openButtonText.value);
		expect(iconElem).toBeInTheDocument();
	});

	it('can change apply button', async () => {
		const text = 'some text';
		const icon = 'cog';
		const rendered = render(<MobileSidebar controller={controller} applyButtonIcon={icon} applyButtonText={text} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const applyButton = rendered.container.querySelector('.ss__mobile-sidebar__footer__apply-button');
			const iconElem = rendered.container.querySelector(`.ss__mobile-sidebar__footer__apply-button .ss__icon--${icon}`);

			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(applyButton).toHaveTextContent(text);
			expect(iconElem).toBeInTheDocument();
		});
	});

	it('can hide the apply button text', async () => {
		const text = 'some text';
		const icon = 'cog';
		const lang = {
			applyButtonText: {
				value: 'lang text',
			},
		};
		const rendered = render(
			<MobileSidebar lang={lang} hideApplyButtonText={true} controller={controller} applyButtonIcon={icon} applyButtonText={text} />
		);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const applyButton = rendered.container.querySelector('.ss__mobile-sidebar__footer__apply-button');
			const iconElem = rendered.container.querySelector(`.ss__mobile-sidebar__footer__apply-button .ss__icon--${icon}`);

			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(applyButton).not.toHaveTextContent(text);
			expect(applyButton).not.toHaveTextContent(lang.applyButtonText.value);
			expect(iconElem).toBeInTheDocument();
		});
	});
	it('can change clear button text', async () => {
		const text = 'click me';
		const icon = 'cog';

		const rendered = render(<MobileSidebar controller={controller} clearButtonIcon={icon} clearButtonText={text} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__footer__clear-button');
			const iconElem = rendered.container.querySelector(`.ss__mobile-sidebar__footer__clear-button .ss__icon--${icon}`);
			expect(iconElem).toBeInTheDocument();
			expect(element).toHaveTextContent(text);
		});
	});

	it('can hide clear button text', async () => {
		const text = 'click me';
		const icon = 'cog';
		const lang = {
			clearButtonText: {
				value: 'lang text',
			},
		};
		const rendered = render(
			<MobileSidebar lang={lang} hideClearButtonText={true} controller={controller} clearButtonIcon={icon} clearButtonText={text} />
		);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__footer__clear-button');
			const iconElem = rendered.container.querySelector(`.ss__mobile-sidebar__footer__clear-button .ss__icon--${icon}`);
			expect(iconElem).toBeInTheDocument();
			expect(element).not.toHaveTextContent(lang.clearButtonText.value);
			expect(element).not.toHaveTextContent(text);
		});
	});

	it('clear button clears filters', async () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(async () => {
			const filterSummaryElement = rendered.container.querySelector('.ss__filter-summary');
			expect(filterSummaryElement).toBeInTheDocument();
		});

		const clearButton = rendered.container.querySelector('.ss__mobile-sidebar__footer__clear-button');

		mockClient.mockData.updateConfig({ search: 'default' });

		userEvent.click(clearButton!);

		await controller.search();

		await waitFor(() => {
			expect(controller.store.filters.length).toBe(0);
			const filterSummaryElement = rendered.container.querySelector('.ss__filter-summary');
			expect(filterSummaryElement).not.toBeInTheDocument();
		});
	});

	it('can hideHeader', async () => {
		const rendered = render(<MobileSidebar controller={controller} hideHeader={true} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			const title = rendered.container.querySelector('.ss__mobile-sidebar__header__title');
			expect(element).toBeInTheDocument();
			expect(title).not.toBeInTheDocument();
		});
	});

	it('can hideFooter', async () => {
		const rendered = render(<MobileSidebar controller={controller} hideFooter={true} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			const footer = rendered.container.querySelector('.ss__mobile-sidebar__footer');
			expect(element).toBeInTheDocument();
			expect(footer).not.toBeInTheDocument();
		});
	});

	it('has expected default titleText', async () => {
		const text = 'Filter Options';
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const title = rendered.container.querySelector('.ss__mobile-sidebar__header__title');
			expect(title?.innerHTML).toBe(text);
		});
	});

	it('can change titleText', async () => {
		const text = 'title text';
		const rendered = render(<MobileSidebar controller={controller} titleText={text} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const title = rendered.container.querySelector('.ss__mobile-sidebar__header__title');
			expect(title?.innerHTML).toBe(text);
		});
	});

	it('can hide titleText', async () => {
		const text = 'title text';
		const lang = {
			titleText: {
				value: 'lang text',
			},
		};
		const rendered = render(<MobileSidebar lang={lang} hideTitleText={true} controller={controller} titleText={text} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const title = rendered.container.querySelector('.ss__mobile-sidebar__header__title');
			expect(title).not.toBeInTheDocument();
		});
	});
	it('can hide Facets', async () => {
		const rendered = render(<MobileSidebar controller={controller} layout={['FilterSummary', 'SortBy', 'PerPage', 'Banner.left']} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const facets = rendered.container.querySelector('.ss__facets');
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(facets).not.toBeInTheDocument();
		});
	});

	it('can hide perpage', async () => {
		const rendered = render(<MobileSidebar controller={controller} layout={['FilterSummary', 'SortBy', 'Facets', 'Banner.left']} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const perpage = rendered.container.querySelector('.ss__perpage__select');
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(perpage).not.toBeInTheDocument();
		});
	});

	it('can hide hideSortBy', async () => {
		const rendered = render(<MobileSidebar controller={controller} layout={['FilterSummary', 'PerPage', 'Facets', 'Banner.left']} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const sortby = rendered.container.querySelector('.ss__sortby__select');
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(sortby).not.toBeInTheDocument();
		});
	});

	it('can hide FilterSummary', async () => {
		const rendered = render(<MobileSidebar controller={controller} layout={['SortBy', 'PerPage', 'Facets', 'Banner.left']} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const summary = rendered.container.querySelector('.ss__filter-summary');
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(summary).not.toBeInTheDocument();
		});
	});

	it('can hide ApplyButton', async () => {
		const rendered = render(<MobileSidebar controller={controller} hideApplyButton={true} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const applyButton = rendered.container.querySelector('.ss__mobile-sidebar__footer__apply-button');
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(applyButton).not.toBeInTheDocument();
		});
	});

	it('has expected default apply button text', async () => {
		const rendered = render(<MobileSidebar controller={controller} />);
		const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
		userEvent.click(slideoutButton!);

		await waitFor(() => {
			const applyButton = rendered.container.querySelector('.ss__mobile-sidebar__footer__apply-button');
			const element = rendered.container.querySelector('.ss__mobile-sidebar__content');
			expect(element).toBeInTheDocument();
			expect(applyButton).toHaveTextContent('Apply');
		});
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<MobileSidebar controller={controller} className={className} />);
		const element = rendered.container.querySelector('.ss__mobile-sidebar');
		expect(element).toHaveClass(className);
	});

	it('disables styles', () => {
		const rendered = render(<MobileSidebar controller={controller} disableStyles />);
		const element = rendered.container.querySelector('.ss__mobile-sidebar');
		expect(element?.classList).toHaveLength(1);
	});

	describe('Sidebar lang works', () => {
		const selector = '.ss__mobile-sidebar';

		it('immediately available lang options', async () => {
			const langOptions = ['titleText', 'clearButtonText', 'applyButtonText', 'closeButtonText', 'openButtonText'];

			//text attributes/values
			const value = 'custom value';
			const altText = 'custom alt';
			const ariaLabel = 'custom label';
			const ariaValueText = 'custom value text';
			const title = 'custom title';

			const valueMock = jest.fn(() => value);
			const altMock = jest.fn(() => altText);
			const labelMock = jest.fn(() => ariaLabel);
			const valueTextMock = jest.fn(() => ariaValueText);
			const titleMock = jest.fn(() => title);

			const langObjs = [
				{
					value: value,
					attributes: {
						alt: altText,
						'aria-label': ariaLabel,
						'aria-valuetext': ariaValueText,
						title: title,
					},
				},
				{
					value: valueMock,
					attributes: {
						alt: altMock,
						'aria-label': labelMock,
						'aria-valuetext': valueTextMock,
						title: titleMock,
					},
				},
				{
					value: `<div>${value}</div>`,
					attributes: {
						alt: altText,
						'aria-label': ariaLabel,
						'aria-valuetext': ariaValueText,
						title: title,
					},
				},
			];

			langOptions.forEach(async (option) => {
				langObjs.forEach(async (langObj) => {
					const lang = {
						[`${option}`]: langObj,
					};

					// @ts-ignore
					const rendered = render(<MobileSidebar controller={controller} lang={lang} />);
					const element = rendered.container.querySelector(selector);
					expect(element).toBeInTheDocument();

					//have to open side bar to render anything
					const slideoutButton = rendered.container.querySelector('.ss__mobile-sidebar__slideout__button');
					userEvent.click(slideoutButton!);

					await waitFor(() => {
						const title = rendered.container.querySelector('.ss__mobile-sidebar__header__title');
						expect(title).toBeInTheDocument();
						let langElem;
						if (option == 'titleText') {
							langElem = rendered.container.querySelector(`[ss-lang=${option}]`);
						} else {
							if (option == 'openButtonText') {
								langElem = rendered.container.querySelector(`.ss__mobile-sidebar__slideout__button [ss-lang=button]`);
							}
							if (option == 'clearButtonText') {
								langElem = rendered.container.querySelector(`.ss__mobile-sidebar__footer__clear-button [ss-lang=button]`);
							}
							if (option == 'applyButtonText') {
								langElem = rendered.container.querySelector(`.ss__mobile-sidebar__footer__apply-button [ss-lang=button]`);
							}
							if (option == 'closeButtonText') {
								langElem = rendered.container.querySelector(`.ss__mobile-sidebar__header__close-button [ss-lang=button]`);
							}
						}

						expect(langElem).toBeInTheDocument();
						if (typeof langObj.value == 'function') {
							expect(langElem?.innerHTML).toBe(value);

							if (option == 'titleText') {
								expect(valueMock).toHaveBeenCalledWith({
									controller: controller,
								});
							} else {
								expect(valueMock).toHaveBeenCalledWith({});
							}
						} else {
							expect(langElem?.innerHTML).toBe(langObj.value);
						}

						expect(langElem).toHaveAttribute('alt', altText);
						expect(langElem).toHaveAttribute('aria-label', ariaLabel);
						expect(langElem).toHaveAttribute('aria-valuetext', ariaValueText);
						expect(langElem).toHaveAttribute('title', title);

						jest.restoreAllMocks();
					});
				});
			});
		});
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
		});
	});
});

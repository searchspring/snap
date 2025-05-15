import { h } from 'preact';
import { render } from '@testing-library/preact';
import { SearchHeader } from './SearchHeader';
import { ThemeProvider } from '../../../providers';
import { MockData } from '@searchspring/snap-shared';
import { SearchMerchandisingStore, SearchPaginationStore, SearchQueryStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

describe('Search Header Component', () => {
	const services = {
		urlManager: new UrlManager(new UrlTranslator()),
	};

	const searchConfig = {
		id: 'search',
	};

	const data = new MockData().searchMeta('dress');

	const paginationStore = new SearchPaginationStore({
		config: searchConfig,
		services,
		data: {
			search: data.search,
			meta: data.meta,
		},
	});
	const queryStore = new SearchQueryStore({
		services,
		data: {
			search: data.search,
		},
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<SearchHeader pagination={paginationStore} query={queryStore} className={className} />);

		const headerElement = rendered.container.querySelector('.ss__search-header');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<SearchHeader pagination={paginationStore} query={queryStore} disableStyles />);

		const headerElement = rendered.container.querySelector('.ss__search-header');

		expect(headerElement?.classList).toHaveLength(1);
	});

	const theme = {
		components: {
			searchHeader: {
				subtitleText: 'hi mom',
			},
		},
	};

	it('is themeable with ThemeProvider', () => {
		const args = {
			pagination: paginationStore,
			query: queryStore,
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<SearchHeader {...args} />
			</ThemeProvider>
		);

		const subtitle = rendered.container.querySelector('.ss__search-header__title--subtitle');
		expect(subtitle?.innerHTML).toBe(theme.components.searchHeader.subtitleText);
	});

	it('is themeable with theme prop', () => {
		const args = {
			pagination: paginationStore,
			query: queryStore,
		};

		const rendered = render(<SearchHeader {...args} theme={theme} />);
		const subtitle = rendered.container.querySelector('.ss__search-header__title--subtitle');
		expect(subtitle?.innerHTML).toBe(theme.components.searchHeader.subtitleText);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const args = {
			pagination: paginationStore,
			query: queryStore,
		};

		const componentTheme = {
			components: {
				searchHeader: {
					subtitleText: 'hi dad',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={theme}>
				<SearchHeader {...args} theme={componentTheme} />
			</ThemeProvider>
		);

		const subtitle = rendered.container.querySelector('.ss__search-header__title--subtitle');
		expect(subtitle?.innerHTML).toBe(componentTheme.components.searchHeader.subtitleText);
	});

	it('renders a custom subtitle', async () => {
		const customsubTitle = 'Custom title';
		const rendered = render(<SearchHeader subtitleText={customsubTitle} pagination={paginationStore} query={queryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header__title--subtitle');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent(customsubTitle);
	});

	it('can hide subtitle', async () => {
		const customsubTitle = 'Custom title';
		const rendered = render(<SearchHeader hideSubtitleText={true} subtitleText={customsubTitle} pagination={paginationStore} query={queryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header__title--subtitle');
		expect(headerElement).not.toBeInTheDocument();
	});

	it('renders a custom subtitle using a function', async () => {
		const customsubTitle = (data: any) => {
			const { pagination, search } = data;
			return `${pagination.totalResults} ${search?.query?.string} subtitle!`;
		};
		const rendered = render(<SearchHeader subtitleText={customsubTitle} pagination={paginationStore} query={queryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header__title--subtitle');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent('1298 dress subtitle!');
	});

	it('dangerously sets the inner html of subtitle', async () => {
		const customsubTitle = (data: any) => {
			const { pagination, search } = data;
			return `<span class="findMe">${pagination.totalResults} ${search?.query?.string} subtitle!</span`;
		};
		const rendered = render(<SearchHeader subtitleText={customsubTitle} pagination={paginationStore} query={queryStore} />);

		const Element = rendered.container.querySelector('.ss__search-header__title--subtitle .findMe');
		expect(Element).toBeInTheDocument();
		expect(Element).toHaveTextContent('1298 dress subtitle!');
	});

	describe('has Results', () => {
		it('renders the default title', async () => {
			const rendered = render(<SearchHeader pagination={paginationStore} query={queryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('Showing 1 - 30 of 1298 results for "dress"');
		});

		it('renders a custom title', async () => {
			const customTitle = 'Custom title';
			const rendered = render(<SearchHeader titleText={customTitle} pagination={paginationStore} query={queryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--results');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent(customTitle);
		});

		it('can hide title', async () => {
			const customTitle = 'Custom title';
			const rendered = render(<SearchHeader hideTitleText={true} titleText={customTitle} pagination={paginationStore} query={queryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--results');
			expect(headerElement).not.toBeInTheDocument();
		});

		it('renders a custom title using a function', async () => {
			const customTitle = (data: any) => {
				const { pagination, search } = data;
				return `look mom ${pagination.totalResults} results found for ${search?.query?.string}!`;
			};
			const rendered = render(<SearchHeader titleText={customTitle} pagination={paginationStore} query={queryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--results');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('look mom 1298 results found for dress!');
		});

		it('dangerously sets the inner html of title', async () => {
			const customTitle = (data: any) => {
				const { pagination, search } = data;
				return `<span class="findMe">look mom ${pagination.totalResults} results found for ${search?.query?.string}!</span>`;
			};
			const rendered = render(<SearchHeader titleText={customTitle} pagination={paginationStore} query={queryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--results .findMe');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('look mom 1298 results found for dress!');
		});
	});

	describe('SearchHeader lang works', () => {
		const selector = '.ss__search-header';

		it('immediately available lang options', async () => {
			const langOptions = ['titleText', 'subtitleText'];

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

			langOptions.forEach((option) => {
				langObjs.forEach((langObj) => {
					const lang = {
						[`${option}`]: langObj,
					};

					// @ts-ignore
					const rendered = render(<SearchHeader lang={lang} pagination={paginationStore} query={queryStore} />);

					const element = rendered.container.querySelector(selector);
					expect(element).toBeInTheDocument();
					const langElem = rendered.container.querySelector(`[ss-lang=${option}]`);
					expect(langElem).toBeInTheDocument();
					if (typeof langObj.value == 'function') {
						expect(valueMock).toHaveBeenLastCalledWith({
							pagination: paginationStore,
							search: queryStore,
						});
						expect(langElem?.innerHTML).toBe(value);
					} else {
						expect(valueMock).not.toHaveBeenCalled();
						expect(langElem?.innerHTML).toBe(langObj.value);
					}

					expect(langElem).toHaveAttribute('alt', altText);
					expect(langElem).toHaveAttribute('aria-label', ariaLabel);
					expect(langElem).toHaveAttribute('aria-valuetext', ariaValueText);
					expect(langElem).toHaveAttribute('title', title);

					jest.clearAllMocks();
				});
			});
		});

		it('custom lang options', async () => {
			//oq
			const oqData = new MockData().searchMeta('oq');
			const oqPaginationStore = new SearchPaginationStore({ config: searchConfig, services, data: { search: oqData.search, meta: oqData.meta } });
			const oqQueryStore = new SearchQueryStore({ services, data: { search: oqData.search } });

			const oqValue = 'oq value';
			const oqAltText = 'oq alt';
			const oqAriaLabel = 'oq label';
			const oqAriaValueText = 'oq value text';
			const oqTitle = 'oq title';

			const oqlang = {
				correctedQueryText: {
					value: oqValue,
					attributes: {
						alt: oqAltText,
						'aria-label': oqAriaLabel,
						'aria-valuetext': oqAriaValueText,
						title: oqTitle,
					},
				},
			};

			const rendered = render(<SearchHeader lang={oqlang} pagination={oqPaginationStore} query={oqQueryStore} />);

			const element = rendered.container.querySelector(selector);
			expect(element).toBeInTheDocument();

			const oqElem = rendered.container.querySelector(`[ss-lang=correctedQueryText]`);

			expect(oqElem).toBeInTheDocument();
			expect(oqElem?.innerHTML).toBe(oqValue);
			expect(oqElem).toHaveAttribute('alt', oqAltText);
			expect(oqElem).toHaveAttribute('aria-label', oqAriaLabel);
			expect(oqElem).toHaveAttribute('aria-valuetext', oqAriaValueText);
			expect(oqElem).toHaveAttribute('title', oqTitle);

			//no results
			const noResultsdata = new MockData().searchMeta('noResults');
			const emptyPaginationStore = new SearchPaginationStore({
				config: searchConfig,
				services,
				data: { search: noResultsdata.search, meta: noResultsdata.meta },
			});
			const emptyQueryStore = new SearchQueryStore({ services, data: { search: noResultsdata.search } });

			const emptyValue = 'empty value';
			const emptyAltText = 'empty alt';
			const emptyAriaLabel = 'empty label';
			const emptyAriaValueText = 'empty value text';
			const emptyTitle = 'empty title';

			const emptylang = {
				noResultsText: {
					value: emptyValue,
					attributes: {
						alt: emptyAltText,
						'aria-label': emptyAriaLabel,
						'aria-valuetext': emptyAriaValueText,
						title: emptyTitle,
					},
				},
			};

			const emptyRendered = render(<SearchHeader lang={emptylang} pagination={emptyPaginationStore} query={emptyQueryStore} />);

			const emptyElement = emptyRendered.container.querySelector(selector);
			expect(emptyElement).toBeInTheDocument();

			const emptyElem = emptyRendered.container.querySelector(`[ss-lang=noResultsText]`);

			expect(emptyElem).toBeInTheDocument();
			expect(emptyElem?.innerHTML).toBe(emptyValue);
			expect(emptyElem).toHaveAttribute('alt', emptyAltText);
			expect(emptyElem).toHaveAttribute('aria-label', emptyAriaLabel);
			expect(emptyElem).toHaveAttribute('aria-valuetext', emptyAriaValueText);
			expect(emptyElem).toHaveAttribute('title', emptyTitle);

			//did you mean
			const dymData = new MockData().searchMeta('dym');
			const dymPaginationStore = new SearchPaginationStore({ config: searchConfig, services, data: { search: dymData.search, meta: dymData.meta } });
			const dymQueryStore = new SearchQueryStore({ services, data: { search: dymData.search } });

			const dymValue = 'dym value';
			const dymAltText = 'dym alt';
			const dymAriaLabel = 'dym label';
			const dymAriaValueText = 'dym value text';
			const dymTitle = 'dym title';

			const dymlang = {
				didYouMeanText: {
					value: dymValue,
					attributes: {
						alt: dymAltText,
						'aria-label': dymAriaLabel,
						'aria-valuetext': dymAriaValueText,
						title: dymTitle,
					},
				},
			};

			const dymRendered = render(<SearchHeader lang={dymlang} pagination={dymPaginationStore} query={dymQueryStore} />);

			const dymElement = dymRendered.container.querySelector(selector);
			expect(dymElement).toBeInTheDocument();

			const dymElem = dymRendered.container.querySelector(`[ss-lang=didYouMeanText]`);

			expect(dymElem).toBeInTheDocument();
			expect(dymElem?.innerHTML).toBe(dymValue);
			expect(dymElem).toHaveAttribute('alt', dymAltText);
			expect(dymElem).toHaveAttribute('aria-label', dymAriaLabel);
			expect(dymElem).toHaveAttribute('aria-valuetext', dymAriaValueText);
			expect(dymElem).toHaveAttribute('title', dymTitle);
		});
	});

	describe('No Results', () => {
		const noResultsdata = new MockData().searchMeta('noResults');
		const emptyPaginationStore = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: noResultsdata.search,
				meta: noResultsdata.meta,
			},
		});
		const emptyQueryStore = new SearchQueryStore({
			services,
			data: {
				search: noResultsdata.search,
			},
		});

		it('renders the default no results title', async () => {
			const rendered = render(<SearchHeader pagination={emptyPaginationStore} query={emptyQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--no-results');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('No results for "blah" found.');
		});

		it('renders a custom no results title', async () => {
			const customNoResults = 'look mom no results found!';
			const rendered = render(<SearchHeader noResultsText={customNoResults} pagination={emptyPaginationStore} query={emptyQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--no-results');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent(customNoResults);
		});

		it('can hide the no results title', async () => {
			const customNoResults = 'look mom no results found!';
			const rendered = render(
				<SearchHeader hideNoResultsText={true} noResultsText={customNoResults} pagination={emptyPaginationStore} query={emptyQueryStore} />
			);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--no-results');
			expect(headerElement).not.toBeInTheDocument();
		});

		it('renders a custom no results title using a function', async () => {
			const customNoResults = (data: any) => {
				const { pagination, search } = data;
				return `look mom ${pagination.totalResults} results found for ${search?.query?.string}!`;
			};
			const rendered = render(<SearchHeader noResultsText={customNoResults} pagination={emptyPaginationStore} query={emptyQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--no-results');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('look mom 0 results found for blah!');
		});

		it('dangerously sets the inner html of no results title', async () => {
			const customTitle = (data: any) => {
				const { pagination, search } = data;
				return `<span class="findMe">look mom ${pagination.totalResults} results found for ${search?.query?.string}!</span>`;
			};
			const rendered = render(<SearchHeader noResultsText={customTitle} pagination={emptyPaginationStore} query={emptyQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--no-results .findMe');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('look mom 0 results found for blah!');
		});
	});

	describe('correctedQueryText', () => {
		const oqData = new MockData().searchMeta('oq');
		const oqPaginationStore = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: oqData.search,
				meta: oqData.meta,
			},
		});
		const oqQueryStore = new SearchQueryStore({
			services,
			data: {
				search: oqData.search,
			},
		});

		it('renders the default correctedQueryText', async () => {
			const rendered = render(<SearchHeader pagination={oqPaginationStore} query={oqQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--corrected');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('No results found for "rodd", showing results for "road" instead.');
		});

		it('renders a custom correctedQueryText', async () => {
			const customoq = 'Custom oq';
			const rendered = render(<SearchHeader correctedQueryText={customoq} pagination={oqPaginationStore} query={oqQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--corrected');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent(customoq);
		});

		it('can hide correctedQueryText', async () => {
			const customoq = 'Custom oq';
			const rendered = render(
				<SearchHeader hideCorrectedQueryText={true} correctedQueryText={customoq} pagination={oqPaginationStore} query={oqQueryStore} />
			);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--corrected');
			expect(headerElement).not.toBeInTheDocument();
		});

		it('renders a custom correctedQueryText using a function', async () => {
			const customoq = (data: any) => {
				const { pagination, search } = data;
				return `${pagination.totalResults} ${search?.query?.string} oq!`;
			};
			const rendered = render(<SearchHeader correctedQueryText={customoq} pagination={oqPaginationStore} query={oqQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--corrected');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('1298 road oq!');
		});

		it('dangerously sets the inner html of correctedQueryText', async () => {
			const customTitle = (data: any) => {
				const { pagination, search } = data;
				return `<span class="findMe">${pagination.totalResults} ${search?.query?.string} oq!</span>`;
			};
			const rendered = render(<SearchHeader correctedQueryText={customTitle} pagination={oqPaginationStore} query={oqQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--corrected .findMe');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('1298 road oq!');
		});
	});

	describe('didyoumean text', () => {
		const dymData = new MockData().searchMeta('dym');
		const dymPaginationStore = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: dymData.search,
				meta: dymData.meta,
			},
		});
		const dymQueryStore = new SearchQueryStore({
			services,
			data: {
				search: dymData.search,
			},
		});

		it('renders the default dymText', async () => {
			const rendered = render(<SearchHeader pagination={dymPaginationStore} query={dymQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--dym');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement?.innerHTML).toBe('Did you mean <a href="/?q=dress">dress</a>?');
		});

		it('renders a custom dymText', async () => {
			const customdym = 'Custom dym';
			const rendered = render(<SearchHeader didYouMeanText={customdym} pagination={dymPaginationStore} query={dymQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--dym');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent(customdym);
		});

		it('can hide dymText', async () => {
			const customdym = 'Custom dym';
			const rendered = render(
				<SearchHeader hideDidYouMeanText={true} didYouMeanText={customdym} pagination={dymPaginationStore} query={dymQueryStore} />
			);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--dym');
			expect(headerElement).not.toBeInTheDocument();
		});

		it('renders a custom dymText using a function', async () => {
			const customdym = (data: any) => {
				const dym = data.search.didYouMean;

				return `Ooops, did you mean <a href=${dym.url.href}>${dym.string}</a>?`;
			};
			const rendered = render(<SearchHeader didYouMeanText={customdym} pagination={dymPaginationStore} query={dymQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--dym');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('Ooops, did you mean dress?');
		});

		it('dangerously sets the inner html of dymText', async () => {
			const customdym = (data: any) => {
				const dym = data.search.didYouMean;
				return `<span class="findMe">Ooops, did you mean <a href=${dym.url.href}>${dym.string}</a>?</span>`;
			};
			const rendered = render(<SearchHeader didYouMeanText={customdym} pagination={dymPaginationStore} query={dymQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--dym .findMe');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('Ooops, did you mean dress?');
			expect(headerElement?.innerHTML).toBe('Ooops, did you mean <a href="/?q=dress">dress</a>?');
		});
	});

	describe('expanded search text', () => {
		const expandedData = new MockData().searchMeta('expanded');
		const expandedPaginationStore = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: expandedData.search,
				meta: expandedData.meta,
			},
		});
		const expandedQueryStore = new SearchQueryStore({
			services,
			data: {
				search: expandedData.search,
			},
		});

		it('renders the default expandedText & search title', async () => {
			const rendered = render(<SearchHeader pagination={expandedPaginationStore} query={expandedQueryStore} />);
			const headerElement = rendered.container.querySelector('.ss__search-header__title--results');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('Showing 1 - 30 of 1298 results for "dress"');

			const expandedElement = rendered.container.querySelector('.ss__search-header__title--expanded');
			expect(expandedElement).toBeInTheDocument();
			expect(expandedElement?.innerHTML).toBe(
				'We couldn\'t find an exact match for "<span classname="ss__query">dress</span>", but here\'s something similar:'
			);
		});

		it('renders a custom expandedText', async () => {
			const customExpanded = 'Custom expanded text';
			const rendered = render(<SearchHeader expandedSearchText={customExpanded} pagination={expandedPaginationStore} query={expandedQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--expanded');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent(customExpanded);
		});

		it('can hide expandedText', async () => {
			const customExpanded = 'Custom expanded text';
			const rendered = render(
				<SearchHeader
					hideExpandedSearchText={true}
					expandedSearchText={customExpanded}
					pagination={expandedPaginationStore}
					query={expandedQueryStore}
				/>
			);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--expanded');
			expect(headerElement).not.toBeInTheDocument();
		});

		it('renders a custom expandedText using a function', async () => {
			const expandedText = (data: any) => {
				const query = data.search?.query?.string;

				return `custom stuff and things ${query}`;
			};
			const rendered = render(<SearchHeader expandedSearchText={expandedText} pagination={expandedPaginationStore} query={expandedQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--expanded');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('custom stuff and things dress');
		});

		it('dangerously sets the inner html of expandedText', async () => {
			const expandedText = (data: any) => {
				const query = data.search?.query?.string;
				return `<span class="findMe">custom stuff and things <label>${query}</label></span>`;
			};
			const rendered = render(<SearchHeader expandedSearchText={expandedText} pagination={expandedPaginationStore} query={expandedQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--expanded .findMe');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('custom stuff and things dress');
			expect(headerElement?.innerHTML).toBe('custom stuff and things <label>dress</label>');
		});
	});

	describe('landing page', () => {
		const landingData = new MockData().searchMeta('landingPage');
		const landingPaginationStore = new SearchPaginationStore({
			config: searchConfig,
			services,
			data: {
				search: landingData.search,
				meta: landingData.meta,
			},
		});
		const landingQueryStore = new SearchQueryStore({
			services,
			data: {
				search: landingData.search,
			},
		});
		const merchandisingStore = new SearchMerchandisingStore({
			data: {
				search: landingData.search,
			},
		});

		it('renders the default correctedQueryText', async () => {
			const rendered = render(<SearchHeader merchandising={merchandisingStore} pagination={landingPaginationStore} query={landingQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--landing-page');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('glasses');
		});
	});
});

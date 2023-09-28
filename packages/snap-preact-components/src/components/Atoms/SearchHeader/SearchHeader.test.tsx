import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import { SearchHeader } from './SearchHeader';
import { Theme, ThemeProvider } from '../../../providers';
import type { SearchResultStore } from '@searchspring/snap-store-mobx';
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

	const paginationStore = new SearchPaginationStore(searchConfig, services, data.pagination, data.meta);
	const queryStore = new SearchQueryStore(services, data.search!);

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<SearchHeader paginationStore={paginationStore} queryStore={queryStore} className={className} />);

		const headerElement = rendered.container.querySelector('.ss__search-header');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<SearchHeader paginationStore={paginationStore} queryStore={queryStore} disableStyles />);

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
			paginationStore: paginationStore,
			queryStore: queryStore,
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
			paginationStore: paginationStore,
			queryStore: queryStore,
		};

		const rendered = render(<SearchHeader {...args} theme={theme} />);
		const subtitle = rendered.container.querySelector('.ss__search-header__title--subtitle');
		expect(subtitle?.innerHTML).toBe(theme.components.searchHeader.subtitleText);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const args = {
			paginationStore: paginationStore,
			queryStore: queryStore,
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
		const rendered = render(<SearchHeader subtitleText={customsubTitle} paginationStore={paginationStore} queryStore={queryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header__title--subtitle');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent(customsubTitle);
	});

	it('renders a custom subtitle using a function', async () => {
		const customsubTitle = (data: any) => {
			const { pagination, search } = data;
			return `${pagination.totalResults} ${search?.query?.string} subtitle!`;
		};
		const rendered = render(<SearchHeader subtitleText={customsubTitle} paginationStore={paginationStore} queryStore={queryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header__title--subtitle');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent('1298 dress subtitle!');
	});

	it('dangerously sets the inner html of subtitle', async () => {
		const customsubTitle = (data: any) => {
			const { pagination, search } = data;
			return `<span class="findMe">${pagination.totalResults} ${search?.query?.string} subtitle!</span`;
		};
		const rendered = render(<SearchHeader subtitleText={customsubTitle} paginationStore={paginationStore} queryStore={queryStore} />);

		const Element = rendered.container.querySelector('.ss__search-header__title--subtitle .findMe');
		expect(Element).toBeInTheDocument();
		expect(Element).toHaveTextContent('1298 dress subtitle!');
	});

	describe('has Results', () => {
		it('renders the default title', async () => {
			const rendered = render(<SearchHeader paginationStore={paginationStore} queryStore={queryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('Showing 1 - 30 of 1298 results for "dress"');
		});

		it('renders a custom title', async () => {
			const customTitle = 'Custom title';
			const rendered = render(<SearchHeader titleText={customTitle} paginationStore={paginationStore} queryStore={queryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--results');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent(customTitle);
		});

		it('renders a custom title using a function', async () => {
			const customTitle = (data: any) => {
				const { pagination, search } = data;
				return `look mom ${pagination.totalResults} results found for ${search?.query?.string}!`;
			};
			const rendered = render(<SearchHeader titleText={customTitle} paginationStore={paginationStore} queryStore={queryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--results');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('look mom 1298 results found for dress!');
		});

		it('dangerously sets the inner html of title', async () => {
			const customTitle = (data: any) => {
				const { pagination, search } = data;
				return `<span class="findMe">look mom ${pagination.totalResults} results found for ${search?.query?.string}!</span>`;
			};
			const rendered = render(<SearchHeader titleText={customTitle} paginationStore={paginationStore} queryStore={queryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--results .findMe');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('look mom 1298 results found for dress!');
		});
	});

	describe('No Results', () => {
		const noResultsdata = new MockData().searchMeta('noResults');
		const emptyPaginationStore = new SearchPaginationStore(searchConfig, services, noResultsdata.pagination, noResultsdata.meta);
		const emptyQueryStore = new SearchQueryStore(services, noResultsdata.search!);

		it('renders the default no results title', async () => {
			const rendered = render(<SearchHeader paginationStore={emptyPaginationStore} queryStore={emptyQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--no-results');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('No results for "blah" found.');
		});

		it('renders a custom no results title', async () => {
			const customNoResults = 'look mom no results found!';
			const rendered = render(<SearchHeader noResultsText={customNoResults} paginationStore={emptyPaginationStore} queryStore={emptyQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--no-results');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent(customNoResults);
		});

		it('renders a custom no results title using a function', async () => {
			const customNoResults = (data: any) => {
				const { pagination, search } = data;
				return `look mom ${pagination.totalResults} results found for ${search?.query?.string}!`;
			};
			const rendered = render(<SearchHeader noResultsText={customNoResults} paginationStore={emptyPaginationStore} queryStore={emptyQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--no-results');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('look mom 0 results found for blah!');
		});

		it('dangerously sets the inner html of no results title', async () => {
			const customTitle = (data: any) => {
				const { pagination, search } = data;
				return `<span class="findMe">look mom ${pagination.totalResults} results found for ${search?.query?.string}!</span>`;
			};
			const rendered = render(<SearchHeader noResultsText={customTitle} paginationStore={emptyPaginationStore} queryStore={emptyQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--no-results .findMe');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('look mom 0 results found for blah!');
		});
	});

	describe('correctedQueryText', () => {
		const oqData = new MockData().searchMeta('oq');
		const oqPaginationStore = new SearchPaginationStore(searchConfig, services, oqData.pagination, oqData.meta);
		const oqQueryStore = new SearchQueryStore(services, oqData.search!);

		it('renders the default correctedQueryText', async () => {
			const rendered = render(<SearchHeader paginationStore={oqPaginationStore} queryStore={oqQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--corrected');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('No results found for "rodd", showing results for "road" instead.');
		});

		it('renders a custom correctedQueryText', async () => {
			const customoq = 'Custom oq';
			const rendered = render(<SearchHeader correctedQueryText={customoq} paginationStore={oqPaginationStore} queryStore={oqQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--corrected');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent(customoq);
		});

		it('renders a custom correctedQueryText using a function', async () => {
			const customoq = (data: any) => {
				const { pagination, search } = data;
				return `${pagination.totalResults} ${search?.query?.string} oq!`;
			};
			const rendered = render(<SearchHeader correctedQueryText={customoq} paginationStore={oqPaginationStore} queryStore={oqQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--corrected');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('1298 road oq!');
		});

		it('dangerously sets the inner html of correctedQueryText', async () => {
			const customTitle = (data: any) => {
				const { pagination, search } = data;
				return `<span class="findMe">${pagination.totalResults} ${search?.query?.string} oq!</span>`;
			};
			const rendered = render(<SearchHeader correctedQueryText={customTitle} paginationStore={oqPaginationStore} queryStore={oqQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--corrected .findMe');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('1298 road oq!');
		});
	});

	describe('didyoumean text', () => {
		const dymData = new MockData().searchMeta('dym');
		const dymPaginationStore = new SearchPaginationStore(searchConfig, services, dymData.pagination, dymData.meta);
		const dymQueryStore = new SearchQueryStore(services, dymData.search!);

		it('renders the default dymText', async () => {
			const rendered = render(<SearchHeader paginationStore={dymPaginationStore} queryStore={dymQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--no-results__dym');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement?.innerHTML).toBe('Did you mean <a href="/?q=dress">dress</a>?');
		});

		it('renders a custom dymText', async () => {
			const customdym = 'Custom dym';
			const rendered = render(<SearchHeader dymText={customdym} paginationStore={dymPaginationStore} queryStore={dymQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--no-results__dym');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent(customdym);
		});

		it('renders a custom dymText using a function', async () => {
			const customdym = (data: any) => {
				const { pagination, search } = data;
				return `${pagination.totalResults} ${search?.query?.string} dym!`;
			};
			const rendered = render(<SearchHeader dymText={customdym} paginationStore={dymPaginationStore} queryStore={dymQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--no-results__dym');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('0 dresss dym!');
		});

		it('dangerously sets the inner html of dymText', async () => {
			const customTitle = (data: any) => {
				const { pagination, search } = data;
				return `<span class="findMe">${pagination.totalResults} ${search?.query?.string} dym!</span>`;
			};
			const rendered = render(<SearchHeader dymText={customTitle} paginationStore={dymPaginationStore} queryStore={dymQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--no-results__dym .findMe');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('0 dresss dym!');
		});
	});

	describe('landing page', () => {
		const landingData = new MockData().searchMeta('landingPage');
		const landingPaginationStore = new SearchPaginationStore(searchConfig, services, landingData.pagination, landingData.meta);
		const landingQueryStore = new SearchQueryStore(services, landingData.search!);
		const merchandisingStore = new SearchMerchandisingStore(services, landingData.merchandising!);

		console.log(merchandisingStore);
		it('renders the default correctedQueryText', async () => {
			const rendered = render(
				<SearchHeader merchandisingStore={merchandisingStore} paginationStore={landingPaginationStore} queryStore={landingQueryStore} />
			);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--landing-page');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('glasses');
		});
	});
});

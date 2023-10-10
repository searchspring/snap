import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import { SearchHeader } from './SearchHeader';
import { ThemeProvider } from '../../../providers';
import themes from '../../../themes';
import { MockData } from '@searchspring/snap-shared';
import { SearchMerchandisingStore, SearchPaginationStore, SearchQueryStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

describe('Search Header Component', () => {
	Object.keys(themes || {}).forEach((themeName) => {
		it(`uses ${themeName} theme`, () => {
			const theme = themes[themeName as keyof typeof themes];
			const rendered = render(<SearchHeader theme={theme} paginationStore={paginationStore} queryStore={queryStore} />);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

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
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can disable styles', () => {
		const rendered = render(<SearchHeader paginationStore={paginationStore} queryStore={queryStore} disableStyles />);

		const headerElement = rendered.container.querySelector('.ss__search-header');

		expect(headerElement?.classList).toHaveLength(1);
		expect(rendered.asFragment()).toMatchSnapshot();
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
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme prop', () => {
		const args = {
			paginationStore: paginationStore,
			queryStore: queryStore,
		};

		const rendered = render(<SearchHeader {...args} theme={theme} />);
		const subtitle = rendered.container.querySelector('.ss__search-header__title--subtitle');
		expect(subtitle?.innerHTML).toBe(theme.components.searchHeader.subtitleText);
		expect(rendered.asFragment()).toMatchSnapshot();
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
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders a custom subtitle', async () => {
		const customsubTitle = 'Custom title';
		const rendered = render(<SearchHeader subtitleText={customsubTitle} paginationStore={paginationStore} queryStore={queryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header__title--subtitle');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent(customsubTitle);
		expect(rendered.asFragment()).toMatchSnapshot();
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
		expect(rendered.asFragment()).toMatchSnapshot();
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
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	describe('has Results', () => {
		it('renders the default title', async () => {
			const rendered = render(<SearchHeader paginationStore={paginationStore} queryStore={queryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('Showing 1 - 30 of 1298 results for "dress"');
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('renders a custom title', async () => {
			const customTitle = 'Custom title';
			const rendered = render(<SearchHeader titleText={customTitle} paginationStore={paginationStore} queryStore={queryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--results');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent(customTitle);
			expect(rendered.asFragment()).toMatchSnapshot();
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
			expect(rendered.asFragment()).toMatchSnapshot();
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
			expect(rendered.asFragment()).toMatchSnapshot();
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
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('renders a custom no results title', async () => {
			const customNoResults = 'look mom no results found!';
			const rendered = render(<SearchHeader noResultsText={customNoResults} paginationStore={emptyPaginationStore} queryStore={emptyQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--no-results');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent(customNoResults);
			expect(rendered.asFragment()).toMatchSnapshot();
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
			expect(rendered.asFragment()).toMatchSnapshot();
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
			expect(rendered.asFragment()).toMatchSnapshot();
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
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('renders a custom correctedQueryText', async () => {
			const customoq = 'Custom oq';
			const rendered = render(<SearchHeader correctedQueryText={customoq} paginationStore={oqPaginationStore} queryStore={oqQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--corrected');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent(customoq);
			expect(rendered.asFragment()).toMatchSnapshot();
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
			expect(rendered.asFragment()).toMatchSnapshot();
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
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	describe('didyoumean text', () => {
		const dymData = new MockData().searchMeta('dym');
		const dymPaginationStore = new SearchPaginationStore(searchConfig, services, dymData.pagination, dymData.meta);
		const dymQueryStore = new SearchQueryStore(services, dymData.search!);

		it('renders the default dymText', async () => {
			const rendered = render(<SearchHeader paginationStore={dymPaginationStore} queryStore={dymQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--dym');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement?.innerHTML).toBe('Did you mean <a href="/?q=dress">dress</a>?');
		});

		it('renders a custom dymText', async () => {
			const customdym = 'Custom dym';
			const rendered = render(<SearchHeader didYouMeanText={customdym} paginationStore={dymPaginationStore} queryStore={dymQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--dym');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent(customdym);
		});

		it('renders a custom dymText using a function', async () => {
			const customdym = (data: any) => {
				const dym = data.search.didYouMean;

				return `Ooops, did you mean <a href=${dym.url.href}>${dym.string}</a>?`;
			};
			const rendered = render(<SearchHeader didYouMeanText={customdym} paginationStore={dymPaginationStore} queryStore={dymQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--dym');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('Ooops, did you mean dress?');
		});

		it('dangerously sets the inner html of dymText', async () => {
			const customdym = (data: any) => {
				const dym = data.search.didYouMean;
				return `<span class="findMe">Ooops, did you mean <a href=${dym.url.href}>${dym.string}</a>?</span>`;
			};
			const rendered = render(<SearchHeader didYouMeanText={customdym} paginationStore={dymPaginationStore} queryStore={dymQueryStore} />);

			const headerElement = rendered.container.querySelector('.ss__search-header__title--dym .findMe');
			expect(headerElement).toBeInTheDocument();
			expect(headerElement).toHaveTextContent('Ooops, did you mean dress?');
			expect(headerElement?.innerHTML).toBe('Ooops, did you mean <a href="/?q=dress">dress</a>?');
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
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});
});

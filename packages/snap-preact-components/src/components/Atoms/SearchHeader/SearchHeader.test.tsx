import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import { SearchHeader } from './SearchHeader';
import { Theme, ThemeProvider } from '../../../providers';
import type { SearchResultStore } from '@searchspring/snap-store-mobx';
import { MockData } from '@searchspring/snap-shared';
import { SearchPaginationStore, SearchQueryStore } from '@searchspring/snap-store-mobx';
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

	it('renders the default title', async () => {
		const rendered = render(<SearchHeader paginationStore={paginationStore} queryStore={queryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent('Showing 1 - 30 of 1298 results for "dress"');
	});

	it('renders a custom title', async () => {
		const customTitle = 'Custom title';
		const rendered = render(<SearchHeader titleText={customTitle} paginationStore={paginationStore} queryStore={queryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header--title');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent(customTitle);
	});

	it('renders a custom title using a function', async () => {
		const customTitle = (data: any) => {
			const { pagination, search } = data;
			return `look mom ${pagination.totalResults} results found for ${search?.query?.string}!`;
		};
		const rendered = render(<SearchHeader titleText={customTitle} paginationStore={paginationStore} queryStore={queryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header--title');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent('look mom 1298 results found for dress!');
	});

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
				subTitleText: 'hi mom',
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

		const subtitle = rendered.container.querySelector('.ss__search-header--subtitle');

		expect(subtitle?.innerHTML).toBe(theme.components.searchHeader.subTitleText);
	});

	it('is themeable with theme prop', () => {
		const args = {
			paginationStore: paginationStore,
			queryStore: queryStore,
		};

		const rendered = render(<SearchHeader {...args} theme={theme} />);
		const subtitle = rendered.container.querySelector('.ss__search-header--subtitle');
		expect(subtitle?.innerHTML).toBe(theme.components.searchHeader.subTitleText);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const args = {
			paginationStore: paginationStore,
			queryStore: queryStore,
		};

		const componentTheme = {
			components: {
				searchHeader: {
					subTitleText: 'hi dad',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={theme}>
				<SearchHeader {...args} theme={componentTheme} />
			</ThemeProvider>
		);

		const subtitle = rendered.container.querySelector('.ss__search-header--subtitle');
		expect(subtitle?.innerHTML).toBe(componentTheme.components.searchHeader.subTitleText);
	});

	const noResultsdata = new MockData().searchMeta('noResults');
	const emptyPaginationStore = new SearchPaginationStore(searchConfig, services, noResultsdata.pagination, noResultsdata.meta);
	const emptyQueryStore = new SearchQueryStore(services, noResultsdata.search!);

	it('renders the default no results title', async () => {
		const rendered = render(<SearchHeader paginationStore={emptyPaginationStore} queryStore={emptyQueryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header--noresultstitle');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent('No results for "blah" found.');
	});

	it('renders a custom no results title', async () => {
		const customNoResults = 'look mom no results found!';
		const rendered = render(<SearchHeader noResultsText={customNoResults} paginationStore={emptyPaginationStore} queryStore={emptyQueryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header--noresultstitle');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent(customNoResults);
	});

	it('renders a custom no results title using a function', async () => {
		const customNoResults = (data: any) => {
			const { pagination, search } = data;
			return `look mom ${pagination.totalResults} results found for ${search?.query?.string}!`;
		};
		const rendered = render(<SearchHeader noResultsText={customNoResults} paginationStore={emptyPaginationStore} queryStore={emptyQueryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header--noresultstitle');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent('look mom 0 results found for blah!');
	});

	it('renders a custom subtitle', async () => {
		const customsubTitle = 'Custom title';
		const rendered = render(<SearchHeader subTitleText={customsubTitle} paginationStore={paginationStore} queryStore={queryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header--subtitle');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent(customsubTitle);
	});

	it('renders a custom subtitle using a function', async () => {
		const customsubTitle = (data: any) => {
			const { pagination, search } = data;
			return `${pagination.totalResults} ${search?.query?.string} subtitle!`;
		};
		const rendered = render(<SearchHeader subTitleText={customsubTitle} paginationStore={paginationStore} queryStore={queryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header--subtitle');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent('1298 dress subtitle!');
	});

	const oqData = new MockData().searchMeta('oq');
	const oqPaginationStore = new SearchPaginationStore(searchConfig, services, oqData.pagination, oqData.meta);
	const oqQueryStore = new SearchQueryStore(services, oqData.search!);

	it('renders the default oq title', async () => {
		const rendered = render(<SearchHeader paginationStore={oqPaginationStore} queryStore={oqQueryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header--oq');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent('No results found for "rodd", showing results for "road" instead.');
	});

	it('renders a custom subtitle', async () => {
		const customoq = 'Custom oq';
		const rendered = render(<SearchHeader oqText={customoq} paginationStore={oqPaginationStore} queryStore={oqQueryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header--oq');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent(customoq);
	});

	it('renders a custom subtitle using a function', async () => {
		const customoq = (data: any) => {
			const { pagination, search } = data;
			return `${pagination.totalResults} ${search?.query?.string} oq!`;
		};
		const rendered = render(<SearchHeader oqText={customoq} paginationStore={oqPaginationStore} queryStore={oqQueryStore} />);

		const headerElement = rendered.container.querySelector('.ss__search-header--oq');
		expect(headerElement).toBeInTheDocument();
		expect(headerElement).toHaveTextContent('1298 road oq!');
	});
});

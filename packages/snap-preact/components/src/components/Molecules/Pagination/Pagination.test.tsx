import { h } from 'preact';

import { render, RenderResult } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { Pagination } from './Pagination';
import { SearchPaginationStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

import { MockData } from '@searchspring/snap-shared';

describe('Pagination Component', () => {
	let rendered: RenderResult;
	const services = {
		urlManager: new UrlManager(new UrlTranslator()),
	};

	const searchConfig = {
		id: 'search',
	};

	const data = new MockData().searchMeta();

	const paginationStore = new SearchPaginationStore({
		config: searchConfig,
		services,
		data: {
			search: data,
			meta: data.meta,
		},
	});

	beforeEach(() => {
		rendered = render(<Pagination pagination={paginationStore} />);
	});

	it('renders', () => {
		const paginationElement = rendered.container.querySelector('.ss__pagination');
		expect(paginationElement).toBeInTheDocument();
	});

	it('doesnt render previous if first page', () => {
		const previousElement = rendered.container.querySelector('.ss__pagination__page--previous');
		expect(previousElement).not.toBeInTheDocument();
	});

	it('renders the last page', () => {
		const last = rendered.container.querySelector('.ss__pagination__page--last');
		expect(last).toBeInTheDocument();
	});

	it('last page has the correct number', () => {
		const last = rendered.container.querySelector('.ss__pagination__page--last');
		expect(last?.innerHTML).toBe(paginationStore.last.number.toString());
	});

	it('renders the next page button', () => {
		const next = rendered.container.querySelector('.ss__pagination__page--next');
		expect(next).toBeInTheDocument();
	});

	it('sets the active page, & the active number matches what is passed in', () => {
		const active = rendered.container.querySelector('.ss__pagination__page--active');
		expect(active).toBeInTheDocument();
		expect(active?.innerHTML).toBe(paginationStore.current.number.toString());
	});

	it('renders the correct number of page options', () => {
		const pages = rendered.container.querySelectorAll('.ss__pagination__page');
		//pages 1 - 5, last, next
		expect(pages).toHaveLength(7);
	});
});

describe('Lets test the Pagination Component optional props', () => {
	const services = {
		urlManager: new UrlManager(new UrlTranslator()),
	};

	const searchConfig = {
		id: 'search',
	};

	const data = new MockData().searchMeta('page10');

	const paginationStore = new SearchPaginationStore({
		config: searchConfig,
		services,
		data: {
			search: data,
			meta: data.meta,
		},
	});

	it('shows all the optional buttons', () => {
		const rendered = render(<Pagination pagination={paginationStore} />);

		const paginationElement = rendered.container.querySelector('.ss__pagination');
		expect(paginationElement).toBeInTheDocument();

		const first = rendered.container.querySelector('.ss__pagination__page--first');
		const last = rendered.container.querySelector('.ss__pagination__page--last');
		const next = rendered.container.querySelector('.ss__pagination__page--next');
		const prev = rendered.container.querySelector('.ss__pagination__page--previous');

		expect(first).toBeInTheDocument();
		expect(last).toBeInTheDocument();
		expect(next).toBeInTheDocument();
		expect(prev).toBeInTheDocument();
		expect(paginationElement).toHaveTextContent('…');
	});

	it('hides first and last', () => {
		const rendered = render(<Pagination pagination={paginationStore} hideFirst={true} hideLast={true} />);
		const paginationElement = rendered.container.querySelector('.ss__pagination');
		expect(paginationElement).toBeInTheDocument();

		const first = rendered.container.querySelector('.ss__pagination__page--first');
		const last = rendered.container.querySelector('.ss__pagination__page--last');
		expect(first).not.toBeInTheDocument();
		expect(last).not.toBeInTheDocument();
	});

	it('hides next and prev', () => {
		const rendered = render(<Pagination pagination={paginationStore} hideNext={true} hidePrev={true} />);
		const paginationElement = rendered.container.querySelector('.ss__pagination');
		expect(paginationElement).toBeInTheDocument();

		const next = rendered.container.querySelector('.ss__pagination__page--next');
		const prev = rendered.container.querySelector('.ss__pagination__page--previous');
		expect(next).not.toBeInTheDocument();
		expect(prev).not.toBeInTheDocument();
	});

	it('hides elipses', () => {
		const rendered = render(<Pagination pagination={paginationStore} hideEllipsis={true} />);

		const paginationElement = rendered.container.querySelector('.ss__pagination');
		expect(paginationElement).toBeInTheDocument();

		expect(paginationElement).not.toHaveTextContent('…');
	});

	it('custom next and prev buttns', () => {
		const rendered = render(<Pagination pagination={paginationStore} nextButton={'NEXT'} prevButton={'PREV'} />);
		const paginationElement = rendered.container.querySelector('.ss__pagination');
		expect(paginationElement).toBeInTheDocument();

		const next = rendered.container.querySelector('.ss__pagination__page--next');
		const prev = rendered.container.querySelector('.ss__pagination__page--previous');
		expect(next).toHaveTextContent('NEXT');
		expect(prev).toHaveTextContent('PREV');
	});

	it('custom first and last buttns', () => {
		const args = {
			firstButton: 'FIRST',
			lastButton: 'LAST',
		};

		const rendered = render(<Pagination pagination={paginationStore} {...args} />);
		const paginationElement = rendered.container.querySelector('.ss__pagination');
		expect(paginationElement).toBeInTheDocument();

		const first = rendered.container.querySelector('.ss__pagination__page--first');
		const last = rendered.container.querySelector('.ss__pagination__page--last');
		expect(first).toHaveTextContent(args.firstButton);
		expect(last).toHaveTextContent(args.lastButton);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Pagination pagination={paginationStore} className={className} />);

		const paginationElement = rendered.container.querySelector('.ss__pagination');
		expect(paginationElement).toBeInTheDocument();
		expect(paginationElement).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<Pagination pagination={paginationStore} disableStyles />);

		const paginationElement = rendered.container.querySelector('.ss__pagination');

		expect(paginationElement?.classList).toHaveLength(1);
	});
});

describe('Pagination theming works', () => {
	const services = {
		urlManager: new UrlManager(new UrlTranslator()),
	};

	const searchConfig = {
		id: 'search',
	};

	const data = new MockData().searchMeta();

	const paginationStore = new SearchPaginationStore({
		config: searchConfig,
		services,
		data: {
			search: data,
			meta: data.meta,
		},
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				pagination: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Pagination pagination={paginationStore} />
			</ThemeProvider>
		);
		const pagination = rendered.container.querySelector('.ss__pagination');
		expect(pagination).toBeInTheDocument();
		expect(pagination?.classList.length).toBe(1);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				pagination: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(<Pagination pagination={paginationStore} theme={propTheme} />);
		const pagination = rendered.container.querySelector('.ss__pagination');
		expect(pagination).toBeInTheDocument();
		expect(pagination?.classList.length).toBe(1);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				pagination: {
					disableStyles: false,
				},
			},
		};
		const propTheme = {
			components: {
				pagination: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Pagination pagination={paginationStore} theme={propTheme} />
			</ThemeProvider>
		);

		const pagination = rendered.container.querySelector('.ss__pagination');
		expect(pagination).toBeInTheDocument();
		expect(pagination?.classList.length).toBe(1);
	});
});

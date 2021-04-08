import { h } from 'preact';

import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers/theme';

import { Pagination } from './Pagination';
import { paginationFirstPageMock as PaginStoreFirstMock, paginationMock } from '../../../mocks/store';

describe('Pagination Component', () => {
	let rendered;
	beforeEach(() => {
		rendered = render(<Pagination pagination={PaginStoreFirstMock} />);
	});

	it('renders', () => {
		const paginationElement = rendered.container.querySelector('.ss-pagination');
		expect(paginationElement).toBeInTheDocument();
	});

	it('doesnt render previous if first page', () => {
		const previousElement = rendered.container.querySelector('.ss-page-previous');
		expect(previousElement).not.toBeInTheDocument();
	});

	it('renders the last page', () => {
		const last = rendered.container.querySelector('.ss-page-last');
		expect(last).toBeInTheDocument();
	});

	it('last page has the correct number', () => {
		const last = rendered.container.querySelector('.ss-page-last');
		expect(last.innerHTML).toBe(PaginStoreFirstMock.last.number.toString());
	});

	it('renders the next page button', () => {
		const next = rendered.container.querySelector('.ss-page-next');
		expect(next).toBeInTheDocument();
	});

	it('sets the active page, & the active number matches what is passed in', () => {
		const active = rendered.container.querySelector('.ss-active');
		expect(active).toBeInTheDocument();
		expect(active.innerHTML).toBe(PaginStoreFirstMock.current.number.toString());
	});

	it('renders the correct number of page options', () => {
		const pages = rendered.container.querySelectorAll('.ss-page');
		//pages 1 - 5, last, next
		expect(pages).toHaveLength(7);
	});
});

describe('Lets test the Pagination Component optional props', () => {
	it('shows all the optional buttons', () => {
		const rendered = render(<Pagination pagination={paginationMock} />);

		const paginationElement = rendered.container.querySelector('.ss-pagination');
		expect(paginationElement).toBeInTheDocument();

		const first = rendered.container.querySelector('.ss-page-first');
		const last = rendered.container.querySelector('.ss-page-last');
		const next = rendered.container.querySelector('.ss-page-next');
		const prev = rendered.container.querySelector('.ss-page-previous');

		expect(first).toBeInTheDocument();
		expect(last).toBeInTheDocument();
		expect(next).toBeInTheDocument();
		expect(prev).toBeInTheDocument();
		expect(paginationElement).toHaveTextContent('…');
	});

	it('hides first and last', () => {
		const rendered = render(<Pagination pagination={paginationMock} hideFirst={true} hideLast={true} />);
		const paginationElement = rendered.container.querySelector('.ss-pagination');
		expect(paginationElement).toBeInTheDocument();

		const first = rendered.container.querySelector('.ss-page-first');
		const last = rendered.container.querySelector('.ss-page-last');
		expect(first).not.toBeInTheDocument();
		expect(last).not.toBeInTheDocument();
	});

	it('hides next and prev', () => {
		const rendered = render(<Pagination pagination={paginationMock} hideNext={true} hidePrev={true} />);
		const paginationElement = rendered.container.querySelector('.ss-pagination');
		expect(paginationElement).toBeInTheDocument();

		const next = rendered.container.querySelector('.ss-page-next');
		const prev = rendered.container.querySelector('.ss-page-previous');
		expect(next).not.toBeInTheDocument();
		expect(prev).not.toBeInTheDocument();
	});

	it('hides elipses', () => {
		const rendered = render(<Pagination pagination={paginationMock} hideEllipsis={true} />);

		const paginationElement = rendered.container.querySelector('.ss-pagination');
		expect(paginationElement).toBeInTheDocument();

		expect(paginationElement).not.toHaveTextContent('…');
	});

	it('custom next and prev buttns', () => {
		const rendered = render(<Pagination pagination={paginationMock} nextButton={'NEXT'} prevButton={'PREV'} />);
		const paginationElement = rendered.container.querySelector('.ss-pagination');
		expect(paginationElement).toBeInTheDocument();

		const next = rendered.container.querySelector('.ss-page-next');
		const prev = rendered.container.querySelector('.ss-page-previous');
		expect(next).toHaveTextContent('NEXT');
		expect(prev).toHaveTextContent('PREV');
	});
});

describe('Pagination theming works', () => {
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
				<Pagination pagination={paginationMock} />
			</ThemeProvider>
		);
		const pagination = rendered.container.querySelector('.ss-pagination');
		expect(pagination).toBeInTheDocument();
		expect(pagination.classList.length).toBe(1);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				pagination: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(<Pagination pagination={paginationMock} theme={propTheme} />);
		const pagination = rendered.container.querySelector('.ss-pagination');
		expect(pagination).toBeInTheDocument();
		expect(pagination.classList.length).toBe(1);
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
				<Pagination pagination={paginationMock} theme={propTheme} />
			</ThemeProvider>
		);

		const pagination = rendered.container.querySelector('.ss-pagination');
		expect(pagination).toBeInTheDocument();
		expect(pagination.classList.length).toBe(1);
	});
});

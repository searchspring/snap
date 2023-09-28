import { h } from 'preact';

import { render, RenderResult, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { LoadMore } from './LoadMore';
import { ThemeProvider } from '../../../providers';
import { SearchPaginationStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

import { MockData } from '@searchspring/snap-shared';

describe('LoadMore Component', () => {
	const services = {
		urlManager: new UrlManager(new UrlTranslator()),
	};

	const searchConfig = {
		id: 'search',
	};

	const data = new MockData().searchMeta();

	const paginationStore = new SearchPaginationStore(searchConfig, services, data.pagination, data.meta);

	let observe: jest.Mock;
	let unobserve: jest.Mock;
	beforeAll(() => {
		observe = jest.fn();
		unobserve = jest.fn();

		// @ts-ignore
		window.IntersectionObserver = jest.fn(() => ({
			observe,
			unobserve,
		}));
	});

	afterEach(() => {
		observe.mockRestore();
		unobserve.mockRestore();
	});

	afterAll(() => {
		// @ts-ignore
		window.IntersectionObserver.mockRestore();
	});

	it('does not render without store', () => {
		const rendered = render(<LoadMore />);
		const loadMoreElement = rendered.container.querySelector('.ss__loadMore');
		expect(loadMoreElement).not.toBeInTheDocument();
	});

	it('renders', () => {
		const rendered = render(<LoadMore pagination={paginationStore} />);
		const loadMoreElement = rendered.container.querySelector('.ss__loadMore');
		expect(loadMoreElement).toBeInTheDocument();
		expect(loadMoreElement?.classList.length).toBe(3);

		// has default progress indicator
		expect(Object.values(loadMoreElement?.classList || {}).includes('ss__loadMore--bar')).toBe(true);

		const buttonElement = rendered.container.querySelector('.ss__loadMore__button');
		expect(buttonElement).toBeInTheDocument();
	});

	it('renders with custom loadMoreText', () => {
		const loadMoreText = 'More Results';
		const rendered = render(<LoadMore pagination={paginationStore} loadMoreText={loadMoreText} />);

		const buttonElement = rendered.container.querySelector('.ss__loadMore__button');
		expect(buttonElement).toBeInTheDocument();
		expect(buttonElement?.textContent).toBe(loadMoreText);
	});

	it('does not render button if auto prop', () => {
		const rendered = render(<LoadMore pagination={paginationStore} auto={true} />);

		const loadMoreElement = rendered.container.querySelector('.ss__loadMore');
		expect(Object.values(loadMoreElement?.classList || {}).includes('ss__loadMore--auto')).toBe(true);

		const buttonElement = rendered.container.querySelector('.ss__loadMore__button');
		expect(buttonElement).not.toBeInTheDocument();
	});

	it('renders button in disabled state if loading', () => {
		const rendered = render(<LoadMore pagination={paginationStore} loading={true} />);

		const loadMoreElement = rendered.container.querySelector('.ss__loadMore');
		expect(Object.values(loadMoreElement?.classList || {}).includes('ss__loadMore--loading')).toBe(true);

		const buttonElement = rendered.container.querySelector('.ss__loadMore__button');
		expect(buttonElement).toHaveAttribute('disabled');
		expect(Object.values(buttonElement?.classList || {}).includes('ss__button--disabled')).toBe(true);
	});

	it('auto prop observes component', () => {
		expect(observe).toHaveBeenCalledTimes(0);
		render(<LoadMore pagination={paginationStore} auto={true} />);
		expect(observe).toHaveBeenCalledTimes(1);
	});

	it('can click on button', async () => {
		const onClick = jest.fn();
		expect(paginationStore.next).toBeDefined();
		expect(paginationStore.current.number).toBe(1);
		expect(paginationStore.pageSize).toBe(30);
		expect(paginationStore.end).toBe(30);

		const rendered = render(<LoadMore pagination={paginationStore} onClick={onClick} />);

		const loadMoreButtonElement = rendered.container.querySelector('.ss__loadMore__button');
		expect(loadMoreButtonElement).toBeInTheDocument();

		expect(onClick).toHaveBeenCalledTimes(0);
		await userEvent.click(loadMoreButtonElement!);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('can set size and width props for bar indicator', async () => {
		const progressIndicatorWidth = 123;
		const progressIndicatorSize = 45;

		const rendered = render(
			<LoadMore pagination={paginationStore} progressIndicatorWidth={progressIndicatorWidth} progressIndicatorSize={progressIndicatorSize} />
		);

		const loadMoreIndicatorElement = rendered.container.querySelector('.ss__loadMore--bar .ss__loadMore__progress__indicator')!;
		expect(loadMoreIndicatorElement).toBeInTheDocument();
		const barIndicatorStyles = getComputedStyle(loadMoreIndicatorElement);
		expect(barIndicatorStyles.maxWidth).toBe(`${progressIndicatorWidth}px`);
		expect(barIndicatorStyles.borderRadius).toBe(`${progressIndicatorSize}px`);

		const loadMoreIndicatorBarElement = rendered.container.querySelector('.ss__loadMore--bar .ss__loadMore__progress__indicator__bar')!;
		expect(loadMoreIndicatorBarElement).toBeInTheDocument();
		const barIndicatorBarStyles = getComputedStyle(loadMoreIndicatorBarElement);
		expect(barIndicatorBarStyles.height).toBe(`${progressIndicatorSize}px`);
		expect(barIndicatorBarStyles.borderRadius).toBe(`${progressIndicatorSize}px`);
	});

	it('renders with radial indicator', () => {
		const rendered = render(<LoadMore pagination={paginationStore} progressIndicator={'radial'} />);
		const loadMoreElement = rendered.container.querySelector('.ss__loadMore');

		expect(Object.values(loadMoreElement?.classList || {}).includes('ss__loadMore--radial')).toBe(true);

		const radialElement = rendered.container.querySelector('.ss__loadMore__progress__indicator__radial');
		expect(radialElement).toBeInTheDocument();
		const styles = getComputedStyle(radialElement!.querySelector('.ss__loadMore__progress__indicator__radial__circle__mask__fill')!);

		const radialAngle = ((360 / 100) * Math.floor((paginationStore.end / paginationStore.totalResults) * 100)) / 2;
		expect(styles.transform).toBe(`rotate(${radialAngle}deg)`);
	});

	it('can set size and width props for radial indicator', async () => {
		const progressIndicatorWidth = 321;
		const progressIndicatorSize = 54;

		const rendered = render(
			<LoadMore
				pagination={paginationStore}
				progressIndicator={'radial'}
				progressIndicatorWidth={progressIndicatorWidth}
				progressIndicatorSize={progressIndicatorSize}
			/>
		);

		const loadMoreIndicatorElement = rendered.container.querySelector('.ss__loadMore--radial .ss__loadMore__progress__indicator__radial__circle')!;
		expect(loadMoreIndicatorElement).toBeInTheDocument();
		const radialIndicatorStyles = getComputedStyle(loadMoreIndicatorElement);
		expect(radialIndicatorStyles.height).toBe(`${progressIndicatorWidth}px`);
		expect(radialIndicatorStyles.width).toBe(`${progressIndicatorWidth}px`);

		const loadMoreIndicatorRadialElement = rendered.container.querySelector('.ss__loadMore--radial .ss__loadMore__progress__text')!;
		expect(loadMoreIndicatorRadialElement).toBeInTheDocument();
		const radialIndicatorBarStyles = getComputedStyle(loadMoreIndicatorRadialElement);
		expect(radialIndicatorBarStyles.height).toBe(`${progressIndicatorWidth - progressIndicatorSize}px`);
		expect(radialIndicatorBarStyles.width).toBe(`${progressIndicatorWidth - progressIndicatorSize}px`);
	});

	it('renders with radial indicator with hideProgressIndicator', () => {
		// since progress text is inside the indicator, make sure that the text is still displayed if hideProgressIndicator is true
		const rendered = render(<LoadMore pagination={paginationStore} progressIndicator={'radial'} hideProgressIndicator={true} />);
		const radialIndicatorElement = rendered.container.querySelector('.ss__loadMore__progress__indicator');
		const radialTextElement = rendered.container.querySelector('.ss__loadMore__progress__text');

		expect(radialIndicatorElement).not.toBeInTheDocument();
		expect(radialTextElement).toBeInTheDocument();
	});

	it('renders with additional style using prop', () => {
		const style = {
			padding: '20px',
		};

		const rendered = render(<LoadMore pagination={paginationStore} style={style} />);
		const loadMoreElement = rendered.container.querySelector('.ss__loadMore')!;
		const styles = getComputedStyle(loadMoreElement);

		expect(styles.padding).toBe(style.padding);
	});

	it('respects disableStyles prop when true', () => {
		const rendered = render(<LoadMore pagination={paginationStore} disableStyles />);
		const loadMoreElement = rendered.container.querySelector('.ss__loadMore');

		expect(loadMoreElement?.classList.length).toBe(2);
	});

	it('respects disableStyles and style prop', () => {
		const style = {
			padding: '20px',
		};

		const rendered = render(<LoadMore pagination={paginationStore} disableStyles style={style} />);
		const loadMoreElement = rendered.container.querySelector('.ss__loadMore')!;

		expect(loadMoreElement?.classList.length).toBe(3);

		const styles = getComputedStyle(loadMoreElement);
		expect(styles.padding).toBe(style.padding);
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				loadMore: {
					className: 'global-theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<LoadMore pagination={paginationStore} />
			</ThemeProvider>
		);

		const loadMoreElement = rendered.container.querySelector('.ss__loadMore');
		expect(loadMoreElement).toHaveClass(globalTheme.components.loadMore.className);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				loadMore: {
					className: 'props-theme-class',
				},
			},
		};

		const rendered = render(<LoadMore pagination={paginationStore} theme={propTheme} />);

		const loadMoreElement = rendered.container.querySelector('.ss__loadMore');
		expect(loadMoreElement).toHaveClass(propTheme.components.loadMore.className);
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				loadMore: {
					className: 'global-class',
				},
			},
		};

		const propTheme = {
			components: {
				loadMore: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<LoadMore pagination={paginationStore} theme={propTheme} />
			</ThemeProvider>
		);

		const loadMoreElement = rendered.container.querySelector('.ss__loadMore');
		expect(loadMoreElement).toHaveClass(propTheme.components.loadMore.className);
		expect(loadMoreElement).not.toHaveClass(globalTheme.components.loadMore.className);
	});
});

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

	const paginationStore = new SearchPaginationStore({
		config: searchConfig,
		services,
		data: {
			search: data.search,
			meta: data.meta,
		},
	});

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
		const loadMoreElement = rendered.container.querySelector('.ss__load-more');
		expect(loadMoreElement).not.toBeInTheDocument();
	});

	it('renders', () => {
		const rendered = render(<LoadMore pagination={paginationStore} />);
		const loadMoreElement = rendered.container.querySelector('.ss__load-more');
		expect(loadMoreElement).toBeInTheDocument();
		expect(loadMoreElement?.classList.length).toBe(2);

		const buttonElement = rendered.container.querySelector('.ss__load-more__button');
		expect(buttonElement).toBeInTheDocument();
	});

	it('renders with custom loadMoreText', () => {
		const loadMoreText = 'More Results';
		const rendered = render(<LoadMore pagination={paginationStore} loadMoreText={loadMoreText} />);

		const buttonElement = rendered.container.querySelector('.ss__load-more__button');
		expect(buttonElement).toBeInTheDocument();
		expect(buttonElement?.textContent).toBe(loadMoreText);
	});

	it('does not render button if autoFetch prop', () => {
		const rendered = render(<LoadMore pagination={paginationStore} autoFetch={true} />);

		const loadMoreElement = rendered.container.querySelector('.ss__load-more');
		expect(Object.values(loadMoreElement?.classList || {}).includes('ss__load-more--autoFetch')).toBe(true);

		const buttonElement = rendered.container.querySelector('.ss__load-more__button');
		expect(buttonElement).not.toBeInTheDocument();
	});

	it('renders button in disabled state if loading', () => {
		const rendered = render(<LoadMore pagination={paginationStore} loading={true} />);

		const loadMoreElement = rendered.container.querySelector('.ss__load-more');
		expect(Object.values(loadMoreElement?.classList || {}).includes('ss__load-more--loading')).toBe(true);

		const buttonElement = rendered.container.querySelector('.ss__load-more__button');
		expect(buttonElement).toHaveAttribute('disabled');
		expect(Object.values(buttonElement?.classList || {}).includes('ss__button--disabled')).toBe(true);
	});

	it('renders different loading icon using loadingIcon prop', () => {
		const loadingIcon = 'cog';
		const rendered = render(<LoadMore pagination={paginationStore} loading={true} loadingIcon={loadingIcon} />);

		const loadingIconElement = rendered.container.querySelector(`.ss__icon--${loadingIcon}`);
		expect(loadingIconElement).toBeInTheDocument();
	});

	it('renders loading icon within button using loadingLocation prop', () => {
		const rendered = render(<LoadMore pagination={paginationStore} loading={true} loadingLocation={'button'} />);

		const loadingIconElement = rendered.container.querySelector(`.ss__button .ss__icon--spinner`);
		expect(loadingIconElement).toBeInTheDocument();
	});

	it('renders different loading icon location using loadingLocation prop', () => {
		const rendered = render(<LoadMore pagination={paginationStore} loading={true} loadingLocation={'outside'} />);

		const loadingIconElement = rendered.container.querySelector(`.ss__button .ss__icon--spinner`);
		expect(loadingIconElement).not.toBeInTheDocument();

		const loadingIconElement2 = rendered.container.querySelector(`.ss__button + .ss__icon--spinner`);
		expect(loadingIconElement2).toBeInTheDocument();
	});

	it('autoFetch prop observes component', () => {
		expect(observe).toHaveBeenCalledTimes(0);
		render(<LoadMore pagination={paginationStore} autoFetch={true} />);
		expect(observe).toHaveBeenCalledTimes(1);
	});

	it('can click on button', async () => {
		const onClick = jest.fn();
		expect(paginationStore.next).toBeDefined();
		expect(paginationStore.current.number).toBe(1);
		expect(paginationStore.pageSize).toBe(30);
		expect(paginationStore.end).toBe(30);

		const rendered = render(<LoadMore pagination={paginationStore} onClick={onClick} />);

		const loadMoreButtonElement = rendered.container.querySelector('.ss__load-more__button');
		expect(loadMoreButtonElement).toBeInTheDocument();

		expect(onClick).toHaveBeenCalledTimes(0);
		await userEvent.click(loadMoreButtonElement!);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('can set size and width props for bar indicator', async () => {
		const progressIndicatorWidth = 123;
		const progressIndicatorSize = 45;

		const rendered = render(
			<LoadMore
				pagination={paginationStore}
				progressIndicatorWidth={`${progressIndicatorWidth}px`}
				progressIndicatorSize={`${progressIndicatorSize}px`}
			/>
		);

		const loadMoreIndicatorElement = rendered.container.querySelector('.ss__load-more .ss__load-more__progress__indicator')!;
		expect(loadMoreIndicatorElement).toBeInTheDocument();
		const barIndicatorStyles = getComputedStyle(loadMoreIndicatorElement);
		expect(barIndicatorStyles.width).toBe(`${progressIndicatorWidth}px`);
		expect(barIndicatorStyles.borderRadius).toBe(`${progressIndicatorSize}px`);

		const loadMoreIndicatorBarElement = rendered.container.querySelector('.ss__load-more .ss__load-more__progress__indicator__bar')!;
		expect(loadMoreIndicatorBarElement).toBeInTheDocument();
		const barIndicatorBarStyles = getComputedStyle(loadMoreIndicatorBarElement);
		expect(barIndicatorBarStyles.height).toBe(`${progressIndicatorSize}px`);
		expect(barIndicatorBarStyles.borderRadius).toBe(`${progressIndicatorSize}px`);
	});

	it('hides progress text using hideProgressText prop', () => {
		const rendered = render(<LoadMore pagination={paginationStore} hideProgressText={true} />);

		const progressIndicatorElement = rendered.container.querySelector('.ss__load-more__progress__indicator')!;
		expect(progressIndicatorElement).toBeInTheDocument();

		const progressTextElement = rendered.container.querySelector('.ss__load-more__progress__text')!;
		expect(progressTextElement).not.toBeInTheDocument();
	});

	it('renders with color and backgroundColor props', () => {
		const colorProps = {
			color: 'rgb(255, 0, 0)',
			backgroundColor: 'rgb(0, 0, 255)',
		};

		const rendered = render(<LoadMore pagination={paginationStore} {...colorProps} />);
		const progressIndicatorElement = rendered.container.querySelector('.ss__load-more__progress__indicator')!;
		const progressIndicatorStyles = getComputedStyle(progressIndicatorElement);

		expect(progressIndicatorStyles.background).toBe(colorProps.backgroundColor);

		const progressIndicatorBarElement = rendered.container.querySelector('.ss__load-more__progress__indicator__bar')!;
		const progressIndicatorBarStyles = getComputedStyle(progressIndicatorBarElement);

		expect(progressIndicatorBarStyles.background).toBe(colorProps.color);
	});

	it('renders with additional style using prop', () => {
		const style = {
			padding: '20px',
		};

		const rendered = render(<LoadMore pagination={paginationStore} style={style} />);
		const loadMoreElement = rendered.container.querySelector('.ss__load-more')!;
		const styles = getComputedStyle(loadMoreElement);

		expect(styles.padding).toBe(style.padding);
	});

	it('respects disableStyles prop when true', () => {
		const rendered = render(<LoadMore pagination={paginationStore} disableStyles />);
		const loadMoreElement = rendered.container.querySelector('.ss__load-more');

		expect(loadMoreElement?.classList.length).toBe(1);
	});

	it('respects disableStyles and style prop', () => {
		const style = {
			padding: '20px',
		};

		const rendered = render(<LoadMore pagination={paginationStore} disableStyles style={style} />);
		const loadMoreElement = rendered.container.querySelector('.ss__load-more')!;

		expect(loadMoreElement?.classList.length).toBe(2);

		const styles = getComputedStyle(loadMoreElement);
		expect(styles.padding).toBe(style.padding);
	});

	describe('loadMore lang works', () => {
		const selector = '.ss__load-more';

		it('immediately available lang options', async () => {
			const langOptions = ['loadMoreButton', 'progressText'];

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

					let valueSatisfied = false;
					let altSatisfied = false;
					let labelSatisfied = false;
					let valueTextSatisfied = false;
					let titleSatisfied = false;

					// @ts-ignore
					const rendered = render(<LoadMore pagination={paginationStore} lang={lang} />);

					const element = rendered.container.querySelector(selector);
					expect(element).toBeInTheDocument();

					const langElems = rendered.container.querySelectorAll(`[ss-lang=${option}]`);
					expect(langElems.length).toBeGreaterThan(0);
					langElems.forEach((elem) => {
						if (typeof langObj.value == 'function') {
							expect(valueMock).toHaveBeenCalledWith({
								pagination: paginationStore,
							});

							if (elem?.innerHTML == value) {
								valueSatisfied = true;
							}
						} else {
							if (elem?.innerHTML == langObj.value) {
								valueSatisfied = true;
							}
						}

						if (elem.getAttribute('alt') == altText) {
							altSatisfied = true;
						}
						if (elem.getAttribute('aria-label') == ariaLabel) {
							labelSatisfied = true;
						}
						if (elem.getAttribute('aria-valuetext') == ariaValueText) {
							valueTextSatisfied = true;
						}
						if (elem.getAttribute('title') == title) {
							titleSatisfied = true;
						}
					});

					expect(valueSatisfied).toBeTruthy();
					expect(altSatisfied).toBeTruthy();
					expect(labelSatisfied).toBeTruthy();
					expect(valueTextSatisfied).toBeTruthy();
					expect(titleSatisfied).toBeTruthy();

					jest.restoreAllMocks();
				});
			});
		});
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

		const loadMoreElement = rendered.container.querySelector('.ss__load-more');
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

		const loadMoreElement = rendered.container.querySelector('.ss__load-more');
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

		const loadMoreElement = rendered.container.querySelector('.ss__load-more');
		expect(loadMoreElement).toHaveClass(propTheme.components.loadMore.className);
		expect(loadMoreElement).not.toHaveClass(globalTheme.components.loadMore.className);
	});
});

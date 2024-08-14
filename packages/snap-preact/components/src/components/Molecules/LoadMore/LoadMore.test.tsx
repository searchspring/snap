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
		const loadMoreElement = rendered.container.querySelector('.ss__load-more');
		expect(loadMoreElement).not.toBeInTheDocument();
	});

	it('renders', () => {
		const rendered = render(<LoadMore pagination={paginationStore} />);
		const loadMoreElement = rendered.container.querySelector('.ss__load-more');
		expect(loadMoreElement).toBeInTheDocument();
		expect(loadMoreElement?.classList.length).toBe(3);

		// has default progress indicator
		expect(Object.values(loadMoreElement?.classList || {}).includes('ss__load-more--bar')).toBe(true);

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

		const loadMoreIndicatorElement = rendered.container.querySelector('.ss__load-more--bar .ss__load-more__progress__indicator')!;
		expect(loadMoreIndicatorElement).toBeInTheDocument();
		const barIndicatorStyles = getComputedStyle(loadMoreIndicatorElement);
		expect(barIndicatorStyles.width).toBe(`${progressIndicatorWidth}px`);
		expect(barIndicatorStyles.borderRadius).toBe(`${progressIndicatorSize}px`);

		const loadMoreIndicatorBarElement = rendered.container.querySelector('.ss__load-more--bar .ss__load-more__progress__indicator__bar')!;
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

	it('renders with radial indicator', () => {
		const rendered = render(<LoadMore pagination={paginationStore} progressIndicator={'radial'} />);
		const loadMoreElement = rendered.container.querySelector('.ss__load-more');

		expect(Object.values(loadMoreElement?.classList || {}).includes('ss__load-more--radial')).toBe(true);

		const radialElement = rendered.container.querySelector('.ss__load-more__progress__indicator__radial');
		expect(radialElement).toBeInTheDocument();
		const styles = getComputedStyle(radialElement!.querySelector('.ss__load-more__progress__indicator__radial__mask__fill')!);
		const radialAngle = Math.max(3.6, ((360 / 100) * Math.floor((paginationStore.end / paginationStore.totalResults) * 100)) / 2);
		expect(styles.transform).toBe(`rotate(${radialAngle}deg)`);
	});

	it('can set size and width props for radial indicator', async () => {
		const progressIndicatorWidth = 321;
		const progressIndicatorSize = 54;

		const rendered = render(
			<LoadMore
				pagination={paginationStore}
				progressIndicator={'radial'}
				progressIndicatorWidth={`${progressIndicatorWidth}px`}
				progressIndicatorSize={`${progressIndicatorSize}px`}
			/>
		);

		const loadMoreIndicatorElement = rendered.container.querySelector('.ss__load-more--radial .ss__load-more__progress__indicator__radial')!;
		expect(loadMoreIndicatorElement).toBeInTheDocument();
		const radialIndicatorStyles = getComputedStyle(loadMoreIndicatorElement);
		expect(radialIndicatorStyles.height).toBe(`${progressIndicatorWidth}px`);
		expect(radialIndicatorStyles.width).toBe(`${progressIndicatorWidth}px`);

		const loadMoreIndicatorRadialElement = rendered.container.querySelector('.ss__load-more--radial .ss__load-more__progress__text')!;
		expect(loadMoreIndicatorRadialElement).toBeInTheDocument();
		const radialIndicatorBarStyles = getComputedStyle(loadMoreIndicatorRadialElement);
		expect(radialIndicatorBarStyles.height).toBe(`calc(${progressIndicatorWidth}px - ${progressIndicatorSize}px)`);
		expect(radialIndicatorBarStyles.width).toBe(`calc(${progressIndicatorWidth}px - ${progressIndicatorSize}px)`);
	});

	it('renders with radial indicator with hideProgressIndicator', () => {
		// since progress text is inside the indicator, make sure that the text is still displayed if hideProgressIndicator is true
		const rendered = render(<LoadMore pagination={paginationStore} progressIndicator={'radial'} hideProgressIndicator={true} />);
		const radialIndicatorElement = rendered.container.querySelector('.ss__load-more__progress__indicator');
		const radialTextElement = rendered.container.querySelector('.ss__load-more__progress__text');

		expect(radialIndicatorElement).not.toBeInTheDocument();
		expect(radialTextElement).toBeInTheDocument();
	});

	it('renders with color and backgroundColor props', () => {
		const colorProps = {
			color: 'red',
			backgroundColor: 'blue',
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

		expect(loadMoreElement?.classList.length).toBe(2);
	});

	it('respects disableStyles and style prop', () => {
		const style = {
			padding: '20px',
		};

		const rendered = render(<LoadMore pagination={paginationStore} disableStyles style={style} />);
		const loadMoreElement = rendered.container.querySelector('.ss__load-more')!;

		expect(loadMoreElement?.classList.length).toBe(3);

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

					let valueSatified = false;
					let altSatified = false;
					let labelSatified = false;
					let valueTextSatified = false;
					let titleSatified = false;

					// @ts-ignore
					const rendered = render(<LoadMore pagination={paginationStore} lang={lang} />);

					const element = rendered.container.querySelector(selector);
					expect(element).toBeInTheDocument();

					const langElems = rendered.container.querySelectorAll(`[ss-lang=${option}]`);
					expect(langElems.length).toBeGreaterThan(0);
					langElems.forEach((elem) => {
						if (typeof langObj.value == 'function') {
							expect(valueMock).toHaveBeenCalledWith({
								paginationStore: paginationStore,
							});

							if (elem?.innerHTML == value) {
								valueSatified = true;
							}
						} else {
							if (elem?.innerHTML == langObj.value) {
								valueSatified = true;
							}
						}

						if (elem.getAttribute('alt') == altText) {
							altSatified = true;
						}
						if (elem.getAttribute('aria-label') == ariaLabel) {
							labelSatified = true;
						}
						if (elem.getAttribute('aria-valuetext') == ariaValueText) {
							valueTextSatified = true;
						}
						if (elem.getAttribute('title') == title) {
							titleSatified = true;
						}
					});

					expect(valueSatified).toBeTruthy();
					expect(altSatified).toBeTruthy();
					expect(labelSatified).toBeTruthy();
					expect(valueTextSatified).toBeTruthy();
					expect(titleSatified).toBeTruthy();

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

import { h } from 'preact';
import { render } from '@testing-library/preact';
import { Result } from './Result';
import { FALLBACK_IMAGE_URL } from '../../Atoms/Image';
import { ThemeProvider } from '../../../providers';
import userEvent from '@testing-library/user-event';
import { ResultsLayout } from '../../../types';
import { SearchResultStore } from '@searchspring/snap-store-mobx';
import { MockData } from '@searchspring/snap-shared';

import type { Product } from '@searchspring/snap-store-mobx';

const mockData = new MockData();
const searchResponse = mockData.searchMeta();

const mockResults = new SearchResultStore({
	config: { id: 'test' },
	state: { loaded: false },
	data: {
		search: searchResponse.search,
		meta: searchResponse.meta,
	},
});

describe('Result Component', () => {
	it('renders', () => {
		const rendered = render(<Result result={mockResults[0] as Product} />);
		const resultElement = rendered.container.querySelector('.ss__result');
		expect(resultElement).toBeInTheDocument();
	});

	it('renders image', () => {
		const rendered = render(<Result result={mockResults[0] as Product} />);
		const imageElement = rendered.container.querySelector('.ss__result .ss__result__image-wrapper .ss__image img');
		expect(imageElement).toBeInTheDocument();
	});

	it('renders title', () => {
		const rendered = render(<Result result={mockResults[0] as Product} />);
		const title = rendered.container.querySelector('.ss__result .ss__result__details .ss__result__details__title');
		expect(title?.textContent).toBe(searchResponse.search.results![0].mappings?.core?.name);
	});

	it('renders pricing', () => {
		const rendered = render(<Result result={mockResults[0] as Product} />);
		const priceElement = rendered.container.querySelectorAll('.ss__result .ss__result__details__pricing .ss__price');
		expect(priceElement[0]).toBeInTheDocument();
		expect(priceElement.length).toBe(2);
	});

	it('renders details', () => {
		const args = {
			result: mockResults[0] as Product,
			detailSlot: <div className="details">Add to cart'</div>,
		};
		const rendered = render(<Result {...args} />);
		const detailsElement = rendered.container.querySelector('.ss__result .ss__result__details .details');
		expect(detailsElement).toBeInTheDocument();
		expect(detailsElement).toHaveTextContent('Add to cart');
	});

	it('hides various sections', () => {
		const args = {
			result: mockResults[0] as Product,
			hideBadge: true,
			hideTitle: true,
			hidePricing: true,
		};
		const rendered = render(<Result {...args} />);
		const badgeElement = rendered.container.querySelector('.ss__result .ss__result__image-wrapper .ss__badge');
		const overlayBadgeElement = rendered.container.querySelector('.ss__result .ss__result__image-wrapper .ss__overlay-badge');
		const calloutBadgeElement = rendered.container.querySelector('.ss__result .ss__result__image-wrapper .ss__callout-badge');
		const titleElement = rendered.container.querySelector('.ss__result .ss__result__details .ss__result__wrapper__details__title');
		const priceElement = rendered.container.querySelector('.ss__result .ss__result__details__pricing .ss__price');
		expect(badgeElement).not.toBeInTheDocument();
		expect(overlayBadgeElement).not.toBeInTheDocument();
		expect(calloutBadgeElement).not.toBeInTheDocument();
		expect(titleElement).not.toBeInTheDocument();
		expect(priceElement).not.toBeInTheDocument();
	});

	it('hides image section', () => {
		const args = {
			result: mockResults[0] as Product,
			hideImage: true,
		};
		const rendered = render(<Result {...args} />);
		const imageElement = rendered.container.querySelector('.ss__result .ss__result__image-wrapper .ss__image');
		expect(imageElement).not.toBeInTheDocument();
	});

	it('should display a fallback image', () => {
		mockResults[1].mappings!.core!.imageUrl = '';
		const rendered = render(<Result result={mockResults[1] as Product} />);
		const imageElement = rendered.container.querySelector('.ss__result .ss__result__image-wrapper .ss__image img');
		expect(imageElement).toHaveAttribute('src', FALLBACK_IMAGE_URL);
	});

	it('should can change the layout', () => {
		const rendered = render(<Result result={mockResults[1] as Product} layout={ResultsLayout.list} />);
		const Element = rendered.container.querySelector('.ss__result');
		expect(Element).toHaveClass(`ss__result--${ResultsLayout.list}`);
	});

	it('can truncate the title', () => {
		const args = {
			result: mockResults[1] as Product,
			truncateTitle: {
				limit: 3,
				append: '...',
			},
		};
		const rendered = render(<Result {...args} />);
		const Element = rendered.container.querySelector('.ss__result__details__title a');
		expect(Element?.innerHTML.length).toBeLessThanOrEqual(6);
		expect(Element).toHaveTextContent('...');
	});

	it('can set a custom onClick function', async () => {
		const onClickFunc = jest.fn();

		const rendered = render(<Result result={mockResults[1] as Product} onClick={onClickFunc} />);
		const resultElement = rendered.container.querySelector('.ss__result a')!;
		expect(resultElement).toBeInTheDocument();

		await userEvent.click(resultElement);
		expect(onClickFunc).toHaveBeenCalled();
	});

	it('does not render ratings or add to cart buttons by default', () => {
		const rendered = render(<Result result={mockResults[1] as Product} />);

		const resultElement = rendered.container.querySelector('.ss__result');
		const ratingElement = rendered.container.querySelector('.ss__result__rating');
		const addToCartElement = rendered.container.querySelector('.ss__result__button--addToCart');

		expect(resultElement).toBeInTheDocument();
		expect(ratingElement).not.toBeInTheDocument();
		expect(addToCartElement).not.toBeInTheDocument();
	});

	it('can render ratings', () => {
		const rendered = render(<Result result={mockResults[1] as Product} hideRating={false} />);
		const resultElement = rendered.container.querySelector('.ss__result');
		const ratingElement = rendered.container.querySelector('.ss__result__rating');

		expect(resultElement).toBeInTheDocument();
		expect(ratingElement).toBeInTheDocument();
	});

	it('can render addToCart button', () => {
		const controller = {
			addToCart: jest.fn(),
		};

		// @ts-ignore
		const rendered = render(<Result controller={controller} result={mockResults[1] as Product} hideATCButton={false} />);

		const resultElement = rendered.container.querySelector('.ss__result');
		const addToCartElement = rendered.container.querySelector('.ss__result__button--addToCart');

		expect(resultElement).toBeInTheDocument();
		expect(addToCartElement).toBeInTheDocument();

		userEvent.click(addToCartElement!);

		expect(controller.addToCart).toHaveBeenCalledWith([mockResults[1]]);
	});

	it('can pass additional function to call on addToCart button click', () => {
		const customFunc = jest.fn();

		const controller = {
			addToCart: jest.fn(),
		};

		// @ts-ignore
		const rendered = render(
			<Result onAddToCartClick={customFunc} controller={controller} result={mockResults[1] as Product} hideATCButton={false} />
		);

		const resultElement = rendered.container.querySelector('.ss__result');
		const addToCartElement = rendered.container.querySelector('.ss__result__button--addToCart');

		expect(resultElement).toBeInTheDocument();
		expect(addToCartElement).toBeInTheDocument();

		userEvent.click(addToCartElement!);

		expect(controller.addToCart).toHaveBeenCalledWith([mockResults[1]]);
		expect(customFunc).toHaveBeenCalledWith(expect.any(Object), mockResults[1]);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Result result={mockResults[1] as Product} className={className} />);

		const resultElement = rendered.container.querySelector('.ss__result');
		expect(resultElement).toBeInTheDocument();
		expect(resultElement).toHaveClass(className);
	});

	it('can disable styles', () => {
		const rendered = render(<Result result={mockResults[1] as Product} disableStyles />);

		const resultElement = rendered.container.querySelector('.ss__result');

		expect(resultElement?.classList).toHaveLength(2);
	});
});

describe('Result lang works', () => {
	// need to mock `matchMedia` to ensure we are not using "mobile" experience
	beforeAll(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query) => ({
				matches: false, // return false
				media: query,
				onchange: null,
				addListener: jest.fn(), // Deprecated
				removeListener: jest.fn(), // Deprecated
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});
	});

	const selector = '.ss__result';

	it('immediately available lang options', async () => {
		const langOptions = ['addToCartButtonText'];

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
				console.log(lang);
				// @ts-ignore
				const rendered = render(<Result result={mockResults[1] as Product} lang={lang} hideATCButton={false} />);
				rendered.debug();
				const element = rendered.container.querySelector(selector);
				expect(element).toBeInTheDocument();
				const langElem = rendered.container.querySelector(`[ss-lang=${option}]`);

				expect(langElem).toBeInTheDocument();

				if (typeof langObj.value == 'function') {
					expect(langElem?.innerHTML).toBe(value);
					expect(valueMock).toHaveBeenCalledWith({ result: mockResults[1], controller: undefined });
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
describe('Result theming works', () => {
	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				result: {
					hideTitle: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Result result={mockResults[0] as Product} />
			</ThemeProvider>
		);
		const result = rendered.container.querySelector('.ss__result');
		const title = rendered.container.querySelector('.ss__result__details__title');
		expect(result).toBeInTheDocument();
		expect(title).not.toBeInTheDocument();
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				result: {
					hideTitle: true,
				},
			},
		};
		const rendered = render(<Result result={mockResults[0] as Product} theme={propTheme} />);
		const result = rendered.container.querySelector('.ss__result');
		const title = rendered.container.querySelector('.ss__result__details__title');
		expect(result).toBeInTheDocument();
		expect(title).not.toBeInTheDocument();
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				result: {
					hideTitle: true,
					hideBadge: true,
				},
			},
		};
		const propTheme = {
			components: {
				result: {
					hideTitle: false,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Result result={mockResults[0] as Product} theme={propTheme} />
			</ThemeProvider>
		);

		const badge = rendered.container.querySelector('.ss__badge');
		const result = rendered.container.querySelector('.ss__result');
		const title = rendered.container.querySelector('.ss__result__details__title');
		expect(result).toBeInTheDocument();
		expect(title).toBeInTheDocument();
		expect(badge).not.toBeInTheDocument();
	});
});

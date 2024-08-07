import { h } from 'preact';

import { render } from '@testing-library/preact';

import { ThemeProvider } from '../../../providers';

import { FacetSlider } from './FacetSlider';
import { sprintf } from '../../../utilities';
import type { RangeFacet } from '@searchspring/snap-store-mobx';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModelFacet, SearchResponseModelFacetRangeAllOf } from '@searchspring/snapi-types';

const mockData = new MockData();
const sliderFacetMock: SearchResponseModelFacet & SearchResponseModelFacetRangeAllOf = mockData
	.search()
	.facets!.filter((facet) => facet.type == 'range')!
	.pop()!;

describe('Slider Component', () => {
	const theme = {
		components: {
			facetSlider: {
				trackColor: 'rgb(255, 0, 0)',
				railColor: 'rgb(0, 255, 0)',
				handleColor: 'rgb(0, 0, 255)',
			},
		},
	};
	const args = {
		facet: sliderFacetMock as RangeFacet,
	};

	it('renders', () => {
		const rendered = render(<FacetSlider {...args} />);
		const sliderElement = rendered.container.querySelector('.ss__facet-slider');
		expect(sliderElement).toBeInTheDocument();
	});

	it('has both slide handles', () => {
		const rendered = render(<FacetSlider {...args} />);
		const sliderHandles = rendered.container.querySelectorAll('.ss__facet-slider__handle');
		expect(sliderHandles.length).toBe(2);
	});

	it('both handles are where they should be and have proper text', () => {
		const rendered = render(<FacetSlider {...args} />);
		const sliderMarks = rendered.container.querySelectorAll('.ss__facet-slider__label');
		expect(sliderMarks[0].textContent).toEqual(sprintf(args.facet.formatValue, args.facet.active?.low));
		expect(sliderMarks[1].textContent).toEqual(sprintf(args.facet.formatValue, args.facet.active?.high));
	});

	it('has custom track, rail, and handle colors', () => {
		const colorArgs = {
			trackColor: 'rgb(100, 0, 0)',
			railColor: 'rgb(0, 100, 0)',
			handleColor: 'rgb(0, 0, 100)',
		};
		const rendered = render(<FacetSlider {...args} {...colorArgs} />);
		const trackElement = rendered.container.querySelector('.ss__facet-slider__segment')!;
		let styles = getComputedStyle(trackElement);
		expect(styles.backgroundColor).toBe(colorArgs.trackColor);

		const railElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__rail')!;
		styles = getComputedStyle(railElement);
		expect(styles.backgroundColor).toBe(colorArgs.railColor);

		const handleElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__handle')!;
		styles = getComputedStyle(handleElement);
		expect(styles.backgroundColor).toBe(colorArgs.handleColor);
	});

	it('can disable styling', () => {
		const rendered = render(<FacetSlider {...args} disableStyles={true} />);

		const paletteElement = rendered.container.querySelector('.ss__facet-slider');
		expect(paletteElement?.classList.length).toBe(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<FacetSlider {...args} className={className} />);

		const paletteElement = rendered.container.querySelector('.ss__facet-slider');
		expect(paletteElement).toBeInTheDocument();
		expect(paletteElement).toHaveClass(className);
	});

	describe('FacetSlider lang works', () => {
		const selector = '.ss__facet-slider';

		it('immediately available lang options', async () => {
			const langOptions = ['sliderHandle'];

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
					const rendered = render(<FacetSlider {...args} lang={lang} />);

					const element = rendered.container.querySelector(selector);
					expect(element).toBeInTheDocument();
					const langElem = rendered.container.querySelector(`[ss-lang=${option}]`);

					expect(langElem).toBeInTheDocument();
					if (typeof langObj.value == 'function') {
						expect(langElem?.innerHTML).toBe(value);

						expect(valueMock).toHaveBeenCalledWith({
							facet: args.facet,
							value: args.facet.range?.low,
						});
						expect(valueMock).toHaveBeenCalledWith({
							facet: args.facet,
							value: args.facet.range?.high,
						});
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

	it('is themeable with ThemeProvider', () => {
		const rendered = render(
			<ThemeProvider theme={theme}>
				<FacetSlider {...args} />
			</ThemeProvider>
		);
		const trackElement = rendered.container.querySelector('.ss__facet-slider__segment')!;
		let styles = getComputedStyle(trackElement);
		expect(styles.backgroundColor).toBe(theme.components.facetSlider.trackColor);

		const railElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__rail')!;
		styles = getComputedStyle(railElement);
		expect(styles.backgroundColor).toBe(theme.components.facetSlider.railColor);

		const handleElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__handle')!;
		styles = getComputedStyle(handleElement);
		expect(styles.backgroundColor).toBe(theme.components.facetSlider.handleColor);
	});

	it('is themeable with theme prop', () => {
		const rendered = render(<FacetSlider {...args} theme={theme} />);
		const trackElement = rendered.container.querySelector('.ss__facet-slider__segment')!;
		let styles = getComputedStyle(trackElement);
		expect(styles.backgroundColor).toBe(theme.components.facetSlider.trackColor);

		const railElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__rail')!;
		styles = getComputedStyle(railElement);
		expect(styles.backgroundColor).toBe(theme.components.facetSlider.railColor);

		const handleElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__handle')!;
		styles = getComputedStyle(handleElement);
		expect(styles.backgroundColor).toBe(theme.components.facetSlider.handleColor);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const themeOverride = {
			components: {
				facetSlider: {
					trackColor: 'rgb(123, 0, 0)',
					railColor: 'rgb(0, 123, 0)',
					handleColor: 'rgb(0, 0, 123)',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<FacetSlider {...args} theme={themeOverride} />
			</ThemeProvider>
		);
		const trackElement = rendered.container.querySelector('.ss__facet-slider__segment')!;
		let styles = getComputedStyle(trackElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.facetSlider.trackColor);

		const railElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__rail')!;
		styles = getComputedStyle(railElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.facetSlider.railColor);

		const handleElement = rendered.container.querySelector('.ss__facet-slider .ss__facet-slider__handle')!;
		styles = getComputedStyle(handleElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.facetSlider.handleColor);
	});
});

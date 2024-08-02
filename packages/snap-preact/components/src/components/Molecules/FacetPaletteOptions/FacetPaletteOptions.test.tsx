import { h } from 'preact';
import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { FacetPaletteOptions } from './FacetPaletteOptions';
import { ThemeProvider } from '../../../providers';
import type { FacetValue } from '@searchspring/snap-store-mobx';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModelFacet, SearchResponseModelFacetValueAllOf } from '@searchspring/snapi-types';

const mockData = new MockData();
const paletteFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = mockData
	.search()
	.facets!.filter((facet) => facet.field == 'pattern')!
	.pop()!;

describe('FacetPaletteOptions Component', () => {
	const theme = {
		components: {
			facetPaletteOptions: {
				columns: 6,
			},
		},
	};

	it('renders', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} />);
		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options');

		expect(paletteElement).toBeInTheDocument();
		expect(paletteElement).toHaveTextContent(paletteFacetMock.values![0].label!);
	});

	it('Palette container element has correct number of classes', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} />);
		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options');
		expect(paletteElement).toBeInTheDocument();
		expect(paletteElement).toHaveClass('ss__facet-palette-options');
	});

	it('maps through and renders the correct number of options', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} />);
		const options = rendered.container.querySelectorAll('.ss__facet-palette-options__option');
		expect(options).toHaveLength(paletteFacetMock.values!.length);
	});

	it('Palette option label element has correct number of classes', () => {
		paletteFacetMock.filtered = true;
		paletteFacetMock.values![0].filtered = true;
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} />);
		const paletteOptionsElement = rendered.container.querySelectorAll('.ss__facet-palette-options__option__value');
		const inactivePaletteOption = paletteOptionsElement[1];
		const activePaletteOption = paletteOptionsElement[0];
		expect(inactivePaletteOption).toHaveClass('ss__facet-palette-options__option__value');
		expect(activePaletteOption.parentElement).toHaveClass('ss__facet-palette-options__option--filtered');
	});

	it('has icons by default', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} />);
		const selectedIcons = rendered.container.querySelector('.ss__icon');
		expect(selectedIcons).toBeInTheDocument();
	});

	it('hideIcons and hideLabel works as expected', () => {
		const rendered = render(<FacetPaletteOptions hideIcon={true} hideLabel={true} values={paletteFacetMock.values as FacetValue[]} />);
		const paletteOptionsElement = rendered.container.querySelector('.ss__facet-palette-options__option__value');
		const selectedIcons = rendered.container.querySelector('.ss__icon');

		expect(paletteOptionsElement).not.toBeInTheDocument();
		expect(selectedIcons).not.toBeInTheDocument();
	});

	it('can use the color mapping', () => {
		const colorMapping = {
			Camo: {
				background: 'brown',
			},
		};
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} colorMapping={colorMapping} />);
		const options = rendered.container.querySelectorAll('.ss__facet-palette-options__option');
		expect(options).toHaveLength(paletteFacetMock.values!.length);
		const paletteOptionsSwatch = rendered.container.querySelector('.ss__facet-palette-options__option__palette--camo');
		const styles = getComputedStyle(paletteOptionsSwatch!);
		expect(styles.background).toEqual(colorMapping['Camo'].background);
	});

	it('can use the color mapping for label', () => {
		const colorMapping = {
			Camo: {
				label: 'brown',
			},
		};
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} colorMapping={colorMapping} />);
		const options = rendered.container.querySelectorAll('.ss__facet-palette-options__option');
		expect(options).toHaveLength(paletteFacetMock.values!.length);
		const paletteOptionsSwatch = rendered.container.querySelector('.ss__facet-palette-options__option__palette--camo');
		const styles = getComputedStyle(paletteOptionsSwatch!);
		expect(styles.background).not.toEqual(colorMapping['Camo'].label);
		expect(paletteOptionsSwatch?.parentElement?.nextSibling).toHaveTextContent(colorMapping['Camo'].label);
	});

	it('can use the color mapping as img', () => {
		const colorMapping = {
			Camo: {
				background: 'url(https://snapui.searchspring.io/favicon.svg)',
			},
		};

		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} colorMapping={colorMapping} />);
		const options = rendered.container.querySelectorAll('.ss__facet-palette-options__option');
		expect(options).toHaveLength(paletteFacetMock.values!.length);
		const paletteOptionsSwatch = rendered.container.querySelector('.ss__facet-palette-options__option__palette--camo');
		const styles = getComputedStyle(paletteOptionsSwatch!);
		expect(styles.background).toEqual(`${colorMapping['Camo'].background}`);
	});

	it('can disable styling', () => {
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} disableStyles={true} />);

		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options');
		expect(paletteElement?.classList.length).toBe(2);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} className={className} />);

		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options');
		expect(paletteElement).toBeInTheDocument();
		expect(paletteElement).toHaveClass(className);
	});

	it('can set custom onClick func', () => {
		const onClickFunc = jest.fn();
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} onClick={onClickFunc} />);

		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options__option')!;
		expect(paletteElement).toBeInTheDocument();
		userEvent.click(paletteElement);
		expect(onClickFunc).toHaveBeenCalled();
	});

	it('can change gapsize and columns', () => {
		const args = {
			gapSize: '10px',
			columns: 2,
		};
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} {...args} />);

		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options')!;
		expect(paletteElement).toBeInTheDocument();
		const styles = getComputedStyle(paletteElement);
		expect(styles.gap).toBe(args.gapSize);
		expect(styles.gridTemplateColumns).toBe(`repeat(${args.columns}, calc((100% - (${args.columns - 1} * ${args.gapSize}))/ ${args.columns}))`);

		const paletteOptionElement = rendered.container.querySelector('.ss__facet-palette-options__option')!;
		const optionStyles = getComputedStyle(paletteOptionElement);
		expect(optionStyles.width).toBe(`calc(100% / ${args.columns} - ${2 * Math.round((args.columns + 2) / 2)}px )`);
	});

	it('can add a count', () => {
		const args = {
			hideCount: false,
		};
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} {...args} />);

		const countElement = rendered.container.querySelectorAll('.ss__facet-palette-options__option__value__count')!;
		expect(countElement).toHaveLength(paletteFacetMock.values!.length);

		countElement.forEach((elem, idx) => {
			if (paletteFacetMock.values![idx].count) {
				// @ts-ignore
				expect(elem).toHaveTextContent(paletteFacetMock.values[idx].count);
			}
		});
	});

	it('can add checkboxes', () => {
		const args = {
			hideCheckbox: false,
		};
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} {...args} />);

		const Element = rendered.container.querySelectorAll('.ss__facet-palette-options__checkbox')!;
		expect(Element).toHaveLength(paletteFacetMock.values!.length);
	});

	it('renders as grid layout by default', () => {
		const args = {};
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} {...args} />);

		const Element = rendered.container.querySelector('.ss__facet-palette-options')!;
		expect(Element).toBeInTheDocument();
		expect(Element).toHaveClass('ss__facet-palette-options--grid');
		expect(Element).not.toHaveClass('ss__facet-palette-options--list');
	});

	it('renders as list layout', () => {
		const args = {
			layout: 'list' as const,
		};
		const rendered = render(<FacetPaletteOptions values={paletteFacetMock.values as FacetValue[]} {...args} />);

		const Element = rendered.container.querySelector('.ss__facet-palette-options')!;
		expect(Element).toBeInTheDocument();
		expect(Element).toHaveClass('ss__facet-palette-options--list');
		expect(Element).not.toHaveClass('ss__facet-palette-options--grid');
	});

	describe('FacetPaletteOptions lang works', () => {
		const selector = '.ss__facet-palette-options';

		it('immediately available lang options', async () => {
			const langOptions = ['paletteOption'];

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
					const rendered = render(<FacetPaletteOptions lang={lang} values={paletteFacetMock.values as FacetValue[]} />);

					const element = rendered.container.querySelector(selector);
					expect(element).toBeInTheDocument();
					const langElem = rendered.container.querySelector(`[ss-lang=${option}]`);

					expect(langElem).toBeInTheDocument();
					if (typeof langObj.value == 'function') {
						expect(langElem?.innerHTML).toBe(value);

						paletteFacetMock.values?.forEach((val, idx) => {
							expect(valueMock).toHaveBeenCalledWith({
								facet: undefined,
								value: val,
							});
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
		const args = {
			values: paletteFacetMock.values as FacetValue[],
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<FacetPaletteOptions {...args} />
			</ThemeProvider>
		);
		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options')!;
		const styles = getComputedStyle(paletteElement);
		expect(styles['grid-template-columns' as keyof CSSStyleDeclaration]).toBe(
			`repeat(${theme.components.facetPaletteOptions.columns}, calc((100% - (${theme.components.facetPaletteOptions.columns - 1} * 8px))/ ${
				theme.components.facetPaletteOptions.columns
			}))`
		);
	});

	it('is themeable with theme prop', () => {
		const args = {
			values: paletteFacetMock.values as FacetValue[],
		};
		const rendered = render(<FacetPaletteOptions {...args} theme={theme} />);
		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options')!;
		const styles = getComputedStyle(paletteElement);
		expect(styles['grid-template-columns' as keyof CSSStyleDeclaration]).toBe(
			`repeat(${theme.components.facetPaletteOptions.columns}, calc((100% - (${theme.components.facetPaletteOptions.columns - 1} * 8px))/ ${
				theme.components.facetPaletteOptions.columns
			}))`
		);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const args = {
			values: paletteFacetMock.values as FacetValue[],
		};
		const themeOverride = {
			components: {
				facetPaletteOptions: {
					columns: 3,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<FacetPaletteOptions {...args} theme={themeOverride} />
			</ThemeProvider>
		);
		const paletteElement = rendered.container.querySelector('.ss__facet-palette-options')!;
		const styles = getComputedStyle(paletteElement);
		expect(styles['grid-template-columns' as keyof CSSStyleDeclaration]).toBe(
			`repeat(${themeOverride.components.facetPaletteOptions.columns}, calc((100% - (${
				themeOverride.components.facetPaletteOptions.columns - 1
			} * 8px))/ ${themeOverride.components.facetPaletteOptions.columns}))`
		);
	});
});

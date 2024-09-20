import { h } from 'preact';

import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { FacetGridOptions } from './FacetGridOptions';
import type { FacetValue } from '@searchspring/snap-store-mobx';
import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModelFacet, SearchResponseModelFacetValueAllOf } from '@searchspring/snapi-types';

const mockData = new MockData();
const gridFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = mockData
	.search()
	.facets!.filter((facet) => facet.field == 'size_dress')!
	.pop()!;

describe('FacetGridOptions Component', () => {
	let gridComponent;
	let gridElement;

	it('renders', () => {
		gridComponent = render(<FacetGridOptions values={gridFacetMock!.values as FacetValue[]} />);

		gridElement = gridComponent.container.querySelector('.ss__facet-grid-options');

		expect(gridElement).toBeInTheDocument();
		expect(gridElement).toHaveTextContent(gridFacetMock.values![0].label!);
	});

	it('has the correct number of options', () => {
		gridComponent = render(<FacetGridOptions values={gridFacetMock.values as FacetValue[]} />);

		const gridOptions = gridComponent.container.querySelectorAll('.ss__facet-grid-options__option');
		expect(gridOptions).toHaveLength(gridFacetMock.values!.length);
	});

	it('has the correct label', () => {
		gridComponent = render(<FacetGridOptions values={gridFacetMock.values as FacetValue[]} />);

		const gridOptions = gridComponent.container.querySelectorAll('.ss__facet-grid-options__option__value');
		for (let i = 0; i < gridOptions.length; i++) {
			expect(gridOptions[i]).toHaveTextContent(gridFacetMock.values![i].label!);
		}
	});

	it('Grid container element has correct number of classes', () => {
		gridComponent = render(<FacetGridOptions values={gridFacetMock.values as FacetValue[]} />);

		gridElement = gridComponent.container.querySelector('.ss__facet-grid-options');

		expect(gridElement?.classList.length).toBe(2);
		expect(gridElement).toHaveClass('ss__facet-grid-options');
	});

	it('Grid option elements have correct classes', () => {
		gridFacetMock.filtered = true;
		gridFacetMock.values![2].filtered = true;

		gridComponent = render(<FacetGridOptions values={gridFacetMock.values as FacetValue[]} />);

		const gridOptionsElement = gridComponent.container.querySelectorAll('.ss__facet-grid-options__option__value');
		const inactiveGridOption = gridOptionsElement[0];
		const activeGridOption = gridOptionsElement[2];
		expect(inactiveGridOption).toHaveClass('ss__facet-grid-options__option__value');
		expect(activeGridOption.parentElement).toHaveClass('ss__facet-grid-options__option--filtered');
	});

	it('Grid option can adjust gapSize & columns', () => {
		const args = {
			gapSize: '10px',
			columns: 2,
		};

		const rendered = render(<FacetGridOptions values={gridFacetMock.values as FacetValue[]} {...args} />);

		const gridOptionsElement = rendered.container.querySelector('.ss__facet-grid-options')!;

		const styles = getComputedStyle(gridOptionsElement);
		expect(styles.gridTemplateColumns).toBe(`repeat(${args.columns}, 1fr)`);
		expect(styles.gap).toBe(args.gapSize);
	});

	it('can disable styling', () => {
		const rendered = render(<FacetGridOptions values={gridFacetMock.values as FacetValue[]} disableStyles={true} />);

		const gridElement = rendered.container.querySelector('.ss__facet-grid-options');
		expect(gridElement?.classList.length).toBe(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<FacetGridOptions values={gridFacetMock.values as FacetValue[]} className={className} />);

		const gridElement = rendered.container.querySelector('.ss__facet-grid-options');
		expect(gridElement).toBeInTheDocument();
		expect(gridElement).toHaveClass(className);
	});
});

describe('facetGridOption lang works', () => {
	const selector = '.ss__facet-grid-options';

	it('immediately available lang options', async () => {
		const langOptions = ['gridOption'];

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
				const rendered = render(<FacetGridOptions lang={lang} values={gridFacetMock.values as FacetValue[]} />);

				const element = rendered.container.querySelector(selector);
				expect(element).toBeInTheDocument();
				const langElem = rendered.container.querySelector(`[ss-lang=${option}]`);

				expect(langElem).toBeInTheDocument();
				if (typeof langObj.value == 'function') {
					expect(langElem?.innerHTML).toBe(value);

					gridFacetMock.values?.forEach((val, idx) => {
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

describe('FacetGridOptions theming works', () => {
	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				facetGridOptions: {
					gapSize: '10px',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FacetGridOptions values={gridFacetMock.values as FacetValue[]} />
			</ThemeProvider>
		);
		const gridElement = rendered.container.querySelector('.ss__facet-grid-options')!;
		const styles = getComputedStyle(gridElement);
		expect(styles.gap).toBe(globalTheme.components.facetGridOptions.gapSize);
		expect(gridElement).toBeInTheDocument();
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				facetGridOptions: {
					gapSize: '10px',
				},
			},
		};
		const rendered = render(<FacetGridOptions values={gridFacetMock.values as FacetValue[]} theme={propTheme} />);
		const gridElement = rendered.container.querySelector('.ss__facet-grid-options')!;
		const styles = getComputedStyle(gridElement);
		expect(styles.gap).toBe(propTheme.components.facetGridOptions.gapSize);
		expect(gridElement).toBeInTheDocument();
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				facetGridOptions: {
					gapSize: '10px',
				},
			},
		};
		const propTheme = {
			components: {
				facetGridOptions: {
					gapSize: '15px',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FacetGridOptions values={gridFacetMock.values as FacetValue[]} theme={propTheme} />
			</ThemeProvider>
		);
		const gridElement = rendered.container.querySelector('.ss__facet-grid-options')!;
		const styles = getComputedStyle(gridElement);
		expect(styles.gap).toBe(propTheme.components.facetGridOptions.gapSize);
		expect(gridElement).toBeInTheDocument();
	});
});

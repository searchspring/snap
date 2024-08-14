import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import { Facet } from './Facet';
import { ThemeProvider } from '../../../providers';

import userEvent from '@testing-library/user-event';
import { ValueFacet, RangeFacet } from '@searchspring/snap-store-mobx';
import { SearchResponseModelFacet, SearchResponseModelFacetValueAllOf } from '@searchspring/snapi-types';
import { MockData } from '@searchspring/snap-shared';

const mockData = new MockData();
const searchResponseFacets = mockData.search().facets!;

const hierarchyFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = searchResponseFacets
	.filter((facet) => facet.field == 'ss_category_hierarchy')!
	.pop()!;
const gridFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = searchResponseFacets
	.filter((facet) => facet.field == 'size_dress')!
	.pop()!;
const paletteFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = searchResponseFacets
	.filter((facet) => facet.field == 'color_family')!
	.pop()!;
const listFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = searchResponseFacets
	.filter((facet) => facet.field == 'season')!
	.pop()!;
const facetOverflowMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = searchResponseFacets
	.filter((facet) => facet.field == 'brand')!
	.pop()!;
const sliderFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = searchResponseFacets
	.filter((facet) => facet.field == 'price')
	.pop()!;

//@ts-ignore
facetOverflowMock.overflow = {
	enabled: true,
	limited: true,
	limit: 12,
	remaining: 2,
	setLimit: () => {},
	toggle: () => {},
	calculate: () => {},
};

describe('Facet Component', () => {
	//TODO: type: FacetType and display: FacetDisplay in interface BaseFacet not compatible with searchResponse mock data!

	describe('List Facet Display', () => {
		it('renders', () => {
			const args = {
				facet: listFacetMock as ValueFacet,
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();
			const count = facetElement?.querySelectorAll('.ss__facet-list-options__option').length;
			expect(count).toEqual(args.facet['values'].length);
		});
	});

	describe('Grid Facet Display', () => {
		it('renders', () => {
			const args = {
				facet: { ...gridFacetMock, display: 'grid' } as ValueFacet,
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();
			const count = facetElement?.querySelectorAll('.ss__facet-grid-options__option').length;
			expect(count).toEqual(args.facet['values'].length);
		});
	});

	describe('Palette Facet Display', () => {
		it('renders', () => {
			const args = {
				facet: { ...paletteFacetMock, display: 'palette' } as ValueFacet,
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet facet={args.facet} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();
			const count = facetElement?.querySelectorAll('.ss__facet-palette-options__option').length;
			expect(count).toEqual(args.facet['values'].length);
		});
	});

	describe('Slider Facet Display', () => {
		it('renders', () => {
			const args = {
				//@ts-ignore
				facet: { ...sliderFacetMock, display: 'slider' } as RangeFacet,
			};
			args.facet.collapsed = false;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options')!;
			expect(facetElement).toBeInTheDocument();
			const sliderElement = facetElement.querySelector('.ss__facet-slider');
			expect(sliderElement).toBeInTheDocument();
		});
	});

	describe('Hierarchy Facet Display', () => {
		it('renders', () => {
			const args = {
				facet: { ...hierarchyFacetMock, display: 'hierarchy' } as ValueFacet,
			};
			args.facet.collapsed = false;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();
			const hierarchyElement = facetElement?.querySelector('.ss__facet-hierarchy-options');
			expect(hierarchyElement).toBeInTheDocument();
		});
	});

	describe('Facet props', () => {
		it('color prop', () => {
			const args = {
				facet: listFacetMock as ValueFacet,
				color: 'red',
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__header')!;
			expect(facetElement).toBeInTheDocument();
			const styles = getComputedStyle(facetElement);
			expect(styles.color).toBe(args.color);
		});

		it('show more/less text prop', async () => {
			const args = {
				facet: facetOverflowMock as ValueFacet,
				showMoreText: 'Show More please',
				showLessText: 'Show Less please',
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__show-more-less')!;
			expect(facetElement).toBeInTheDocument();
			expect(facetElement).toHaveTextContent(args.showMoreText);

			userEvent.click(facetElement);

			await waitFor(() => expect(facetElement).toHaveTextContent(args.showMoreText));
		});

		it('renders with specified icons', async () => {
			const args = {
				facet: facetOverflowMock as ValueFacet,
				iconCollapse: 'angle-down',
				iconExpand: 'angle-up',
				iconOverflowMore: 'check',
				iconOverflowLess: 'circle',
			};
			const rendered = render(<Facet {...args} />);

			const headerIconElement = rendered.container.querySelector('.ss__facet__header .ss__icon');
			const showMoreLessElem = rendered.container.querySelector('.ss__facet__show-more-less .ss__icon');

			expect(headerIconElement).toBeInTheDocument();
			expect(headerIconElement).toHaveClass(`ss__icon--${args.iconCollapse}`);
			expect(showMoreLessElem).toHaveClass(`ss__icon--${args.iconOverflowMore}`);

			args.facet.collapsed = false;

			const rendered2 = render(<Facet {...args} />);

			const headerIconElement2 = rendered2.container.querySelector('.ss__facet__header .ss__icon');
			const showMoreLessElem2 = rendered2.container.querySelector('.ss__facet__show-more-less .ss__icon');

			expect(headerIconElement2).toBeInTheDocument();
			expect(headerIconElement2).toHaveClass(`ss__icon--${args.iconCollapse}`);
			expect(showMoreLessElem2).toHaveClass(`ss__icon--${args.iconOverflowMore}`);
		});

		it('set custom overflow slot', async () => {
			const elem = <span className="findMe">Show More please</span>;
			const args = {
				facet: facetOverflowMock as ValueFacet,
				overflowSlot: elem,
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__show-more-less');
			expect(facetElement).toBeInTheDocument();
			const overflowSlot = rendered.container.querySelector('.findMe');
			expect(overflowSlot).toBeInTheDocument();
			expect(overflowSlot).toHaveTextContent('Show More please');
		});

		it('set custom options slot', async () => {
			const option = <span className="findMe">stuff and things</span>;
			const args = {
				facet: facetOverflowMock as ValueFacet,
				optionsSlot: option,
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();

			const optionsSlot = rendered.container.querySelector('.findMe');
			expect(optionsSlot).toBeInTheDocument();
			expect(optionsSlot).toHaveTextContent('stuff and things');
		});

		it('can use limit prop', async () => {
			const args = {
				facet: facetOverflowMock as ValueFacet,
				limit: 3,
				disableOverflow: true,
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelectorAll('.ss__facet-list-options__option');

			expect(facetElement.length).toBe(args.limit);
		});

		it('can use searchable prop', async () => {
			const args = {
				facet: { ...listFacetMock, display: 'list' } as ValueFacet,
				searchable: true,
			};
			const rendered = render(<Facet {...args} />);

			const searchInputElement = rendered.container.querySelector('.ss__search-input input')!;
			expect(searchInputElement).toBeInTheDocument();
			userEvent.type(searchInputElement, 'su');

			await waitFor(() => expect(searchInputElement).toHaveValue('su'));
			expect(searchInputElement).toHaveValue('su');

			const optionsElement = rendered.container.querySelector('.ss__facet__options');
			expect(optionsElement).toHaveTextContent('Summer');
		});
	});

	it('renders with classname', () => {
		const args = {
			facet: listFacetMock as ValueFacet,
			className: 'classy',
		};

		const rendered = render(<Facet {...args} />);

		const facetElement = rendered.container.querySelector('.ss__facet');
		expect(facetElement).toHaveClass(args.className);
	});

	it('disables styles', () => {
		const args = {
			facet: listFacetMock as ValueFacet,
			disableStyles: true,
		};

		const rendered = render(<Facet {...args} />);

		const facetElement = rendered.container.querySelector('.ss__facet');

		expect(facetElement?.classList).toHaveLength(3);
	});

	describe('Facet lang works', () => {
		const selector = '.ss__facet';

		const facet = facetOverflowMock as ValueFacet;

		it('immediately available lang options', async () => {
			const langOptions = ['showMoreText', 'dropdownButton'];

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
					const rendered = render(<Facet facet={facet} lang={lang} />);
					const element = rendered.container.querySelector(selector);
					expect(element).toBeInTheDocument();

					const langElems = rendered.container.querySelectorAll(`[ss-lang=${option}]`);
					expect(langElems.length).toBeGreaterThan(0);
					langElems.forEach((elem) => {
						if (typeof langObj.value == 'function') {
							expect(valueMock).toHaveBeenCalledWith({
								facet: facet,
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

		it('custom lang options', async () => {
			//@ts-ignore
			facetOverflowMock.overflow = {
				enabled: true,
				limited: false,
				limit: 12,
				remaining: 0,
				setLimit: () => {},
				toggle: () => {},
				calculate: () => {},
			};

			let _facet = facetOverflowMock as ValueFacet;

			const lessValue = 'less value';
			const lessAltText = 'less alt';
			const lessAriaLabel = 'less label';
			const lessAriaValueText = 'less value text';
			const lessTitle = 'less title';

			const valueMock = jest.fn(() => lessValue);
			const altMock = jest.fn(() => lessAltText);
			const labelMock = jest.fn(() => lessAriaLabel);
			const valueTextMock = jest.fn(() => lessAriaValueText);
			const titleMock = jest.fn(() => lessTitle);

			const langObjs = [
				{
					value: lessValue,
					attributes: {
						alt: lessAltText,
						'aria-label': lessAriaLabel,
						'aria-valuetext': lessAriaValueText,
						title: lessTitle,
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
					value: `<div>${lessValue}</div>`,
					attributes: {
						alt: lessAltText,
						'aria-label': lessAriaLabel,
						'aria-valuetext': lessAriaValueText,
						title: lessTitle,
					},
				},
			];

			let valueSatified = false;
			let altSatified = false;
			let labelSatified = false;
			let valueTextSatified = false;
			let titleSatified = false;

			langObjs.forEach(async (langObj) => {
				const lang = {
					[`showLessText`]: langObj,
				};

				const rendered = render(<Facet facet={_facet} lang={lang} />);

				const element = rendered.container.querySelector(selector);
				expect(element).toBeInTheDocument();

				const langElems = rendered.container.querySelectorAll(`[ss-lang=showLessText]`);
				expect(langElems.length).toBeGreaterThan(0);
				langElems.forEach((elem) => {
					if (typeof langObj.value == 'function') {
						expect(valueMock).toHaveBeenCalledWith({
							facet: facet,
						});

						if (elem?.innerHTML == lessValue) {
							valueSatified = true;
						}
					} else {
						if (elem?.innerHTML == langObj.value) {
							valueSatified = true;
						}
					}

					if (elem.getAttribute('alt') == lessAltText) {
						altSatified = true;
					}
					if (elem.getAttribute('aria-label') == lessAriaLabel) {
						labelSatified = true;
					}
					if (elem.getAttribute('aria-valuetext') == lessAriaValueText) {
						valueTextSatified = true;
					}
					if (elem.getAttribute('title') == lessTitle) {
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

	describe('Facet theming works', () => {
		it('is themeable with ThemeProvider', () => {
			const globalTheme = {
				components: {
					facet: {
						className: 'classy',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Facet facet={listFacetMock as ValueFacet} />
				</ThemeProvider>
			);
			const facet = rendered.container.querySelector('.ss__facet');
			expect(facet).toBeInTheDocument();
			expect(facet).toHaveClass(globalTheme.components.facet.className);
		});

		it('is themeable with theme prop', () => {
			const propTheme = {
				components: {
					facet: {
						className: 'classy',
					},
				},
			};
			const rendered = render(<Facet facet={listFacetMock as ValueFacet} theme={propTheme} />);
			const facet = rendered.container.querySelector('.ss__facet');
			expect(facet).toBeInTheDocument();
			expect(facet).toHaveClass(propTheme.components.facet.className);
		});

		it('is theme prop overrides ThemeProvider', () => {
			const globalTheme = {
				components: {
					facet: {
						className: 'not classy',
					},
				},
			};
			const propTheme = {
				components: {
					facet: {
						className: 'classy',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Facet facet={listFacetMock as ValueFacet} theme={propTheme} />
				</ThemeProvider>
			);

			const facet = rendered.container.querySelector('.ss__facet');
			expect(facet).toBeInTheDocument();
			expect(facet).toHaveClass(propTheme.components.facet.className);
			expect(facet).not.toHaveClass(globalTheme.components.facet.className);
		});
	});
});

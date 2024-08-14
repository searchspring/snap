import { h } from 'preact';
import { render } from '@testing-library/preact';
import { HorizontalFacets } from './HorizontalFacets';
import { IndividualFacetType } from '../Facets/Facets';
import { ThemeProvider } from '../../../providers';
import userEvent from '@testing-library/user-event';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModel } from '@searchspring/snapi-types';

const mockData = new MockData();
const searchResponse: SearchResponseModel = mockData.search();

describe('HorizontalFacets Component', () => {
	it('renders', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};
		const rendered = render(<HorizontalFacets {...args} />);
		const horizontalFacetsElement = rendered.container.querySelector('.ss__horizontal-facets');
		expect(horizontalFacetsElement).toBeInTheDocument();
	});

	it('limits number of facets and displays sidebar overflow', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			limit: 2,
		};
		const rendered = render(<HorizontalFacets {...args} />);
		const facetsDropdown = rendered.container.querySelectorAll('.ss__horizontal-facets__header__dropdown');
		expect(facetsDropdown).toHaveLength(args.limit);

		const mobileSidebar = rendered.container.querySelector('.ss__horizontal-facets__header__mobile-sidebar');
		expect(mobileSidebar).toBeInTheDocument();
	});

	it('always shows overflow using alwaysShowFiltersButton', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			alwaysShowFiltersButton: true,
		};
		const rendered = render(<HorizontalFacets {...args} />);

		const mobileSidebar = rendered.container.querySelector('.ss__horizontal-facets__header__mobile-sidebar');
		expect(mobileSidebar).toBeInTheDocument();
	});

	it('renders as dropdown overlay using overlay prop', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			overlay: true,
		};
		const rendered = render(<HorizontalFacets {...args} />);

		const facetElement = rendered.container.querySelector(
			`.ss__horizontal-facets--overlay .ss__horizontal-facets__header .ss__horizontal-facets__header__dropdown--${args.facets[0].field} .ss__facet__options`
		);
		expect(facetElement).toBeInTheDocument();
	});

	it('renders with className', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			className: 'classy',
		};

		const rendered = render(<HorizontalFacets {...args} />);

		const horizontalFacetsElement = rendered.container.querySelector('.ss__horizontal-facets');
		expect(horizontalFacetsElement).toHaveClass(args.className);
	});

	it('disableStyles', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			disableStyles: true,
		};

		const rendered = render(<HorizontalFacets {...args} />);

		const horizontalFacetsElement = rendered.container.querySelector('.ss__horizontal-facets');
		expect(horizontalFacetsElement?.classList).toHaveLength(1);
	});

	describe('HorizontalFacets lang works', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};

		const selector = '.ss__horizontal-facets';

		it('immediately available lang options', async () => {
			const langOptions = ['dropdownButton'];

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
					const rendered = render(<HorizontalFacets {...args} lang={lang} />);
					const element = rendered.container.querySelector(selector);
					expect(element).toBeInTheDocument();

					const langElems = rendered.container.querySelectorAll(`[ss-lang=${option}]`);
					expect(langElems.length).toBeGreaterThan(0);
					langElems.forEach((elem) => {
						if (typeof langObj.value == 'function') {
							searchResponse.facets?.forEach((facet, idx) => {
								if (idx < 6) {
									expect(valueMock).toHaveBeenCalledWith({
										selectedFacet: undefined,
										facet: facet,
									});
								}
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
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};
		const globalTheme = {
			components: {
				horizontalFacets: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<HorizontalFacets {...args} />
			</ThemeProvider>
		);
		const horizontalFacetsElement = rendered.container.querySelector('.ss__horizontal-facets');
		expect(horizontalFacetsElement).toBeInTheDocument();
		expect(horizontalFacetsElement).toHaveClass(globalTheme.components.horizontalFacets.className);
	});

	it('is themeable with theme prop', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};
		const propTheme = {
			components: {
				horizontalFacets: {
					className: 'classy',
				},
			},
		};
		const rendered = render(<HorizontalFacets {...args} theme={propTheme} />);
		const horizontalFacetsElement = rendered.container.querySelector('.ss__horizontal-facets');
		expect(horizontalFacetsElement).toBeInTheDocument();
		expect(horizontalFacetsElement).toHaveClass(propTheme.components.horizontalFacets.className);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};
		const globalTheme = {
			components: {
				horizontalFacets: {
					className: 'notClassy',
				},
			},
		};
		const propTheme = {
			components: {
				horizontalFacets: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<HorizontalFacets {...args} theme={propTheme} />
			</ThemeProvider>
		);

		const horizontalFacetsElement = rendered.container.querySelector('.ss__horizontal-facets');
		expect(horizontalFacetsElement).toBeInTheDocument();
		expect(horizontalFacetsElement).toHaveClass(propTheme.components.horizontalFacets.className);
		expect(horizontalFacetsElement).not.toHaveClass(globalTheme.components.horizontalFacets.className);
	});
});

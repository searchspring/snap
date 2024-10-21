import { h } from 'preact';
import { render } from '@testing-library/preact';
import { FacetsHorizontal } from './FacetsHorizontal';
import { IndividualFacetType } from '../Facets/Facets';
import { ThemeProvider } from '../../../providers';
import userEvent from '@testing-library/user-event';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModel } from '@searchspring/snapi-types';

const mockData = new MockData();
const searchResponse: SearchResponseModel = mockData.search();

describe('FacetsHorizontal Component', () => {
	it('renders', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};
		const rendered = render(<FacetsHorizontal {...args} />);
		const facetsHorizontalElement = rendered.container.querySelector('.ss__facets-horizontal');
		expect(facetsHorizontalElement).toBeInTheDocument();
	});

	it('limits number of facets and displays sidebar overflow', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			limit: 2,
		};
		const rendered = render(<FacetsHorizontal {...args} />);
		const facetsDropdown = rendered.container.querySelectorAll('.ss__facets-horizontal__header__dropdown');
		expect(facetsDropdown).toHaveLength(args.limit);

		const mobileSidebar = rendered.container.querySelector('.ss__facets-horizontal__header__mobile-sidebar');
		expect(mobileSidebar).toBeInTheDocument();
	});

	it('always shows overflow using alwaysShowFiltersButton', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			alwaysShowFiltersButton: true,
		};
		const rendered = render(<FacetsHorizontal {...args} />);

		const mobileSidebar = rendered.container.querySelector('.ss__facets-horizontal__header__mobile-sidebar');
		expect(mobileSidebar).toBeInTheDocument();
	});

	it('renders as dropdown overlay using overlay prop', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			overlay: true,
		};
		const rendered = render(<FacetsHorizontal {...args} />);

		const facetElement = rendered.container.querySelector(
			`.ss__facets-horizontal--overlay .ss__facets-horizontal__header .ss__facets-horizontal__header__dropdown--${args.facets[0].field} .ss__facet__options`
		);
		expect(facetElement).toBeInTheDocument();
	});

	it('renders with className', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			className: 'classy',
		};

		const rendered = render(<FacetsHorizontal {...args} />);

		const facetsHorizontalElement = rendered.container.querySelector('.ss__facets-horizontal');
		expect(facetsHorizontalElement).toHaveClass(args.className);
	});

	it('disableStyles', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			disableStyles: true,
		};

		const rendered = render(<FacetsHorizontal {...args} />);

		const facetsHorizontalElement = rendered.container.querySelector('.ss__facets-horizontal');
		expect(facetsHorizontalElement?.classList).toHaveLength(2);
	});

	describe('FacetsHorizontal lang works', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};

		const selector = '.ss__facets-horizontal';

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

					let valueSatisfied = false;
					let altSatisfied = false;
					let labelSatisfied = false;
					let valueTextSatisfied = false;
					let titleSatisfied = false;

					// @ts-ignore
					const rendered = render(<FacetsHorizontal {...args} lang={lang} />);
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
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};
		const globalTheme = {
			components: {
				facetsHorizontal: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FacetsHorizontal {...args} />
			</ThemeProvider>
		);
		const facetsHorizontalElement = rendered.container.querySelector('.ss__facets-horizontal');
		expect(facetsHorizontalElement).toBeInTheDocument();
		expect(facetsHorizontalElement).toHaveClass(globalTheme.components.facetsHorizontal.className);
	});

	it('is themeable with theme prop', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};
		const propTheme = {
			components: {
				facetsHorizontal: {
					className: 'classy',
				},
			},
		};
		const rendered = render(<FacetsHorizontal {...args} theme={propTheme} />);
		const facetsHorizontalElement = rendered.container.querySelector('.ss__facets-horizontal');
		expect(facetsHorizontalElement).toBeInTheDocument();
		expect(facetsHorizontalElement).toHaveClass(propTheme.components.facetsHorizontal.className);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};
		const globalTheme = {
			components: {
				facetsHorizontal: {
					className: 'notClassy',
				},
			},
		};
		const propTheme = {
			components: {
				facetsHorizontal: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FacetsHorizontal {...args} theme={propTheme} />
			</ThemeProvider>
		);

		const facetsHorizontalElement = rendered.container.querySelector('.ss__facets-horizontal');
		expect(facetsHorizontalElement).toBeInTheDocument();
		expect(facetsHorizontalElement).toHaveClass(propTheme.components.facetsHorizontal.className);
		expect(facetsHorizontalElement).not.toHaveClass(globalTheme.components.facetsHorizontal.className);
	});
});

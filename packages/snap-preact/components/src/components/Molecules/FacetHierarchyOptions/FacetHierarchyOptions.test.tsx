import { h } from 'preact';
import { render, RenderResult, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../providers';

import { FacetHierarchyOptions } from './FacetHierarchyOptions';
import { SearchFacetStore, StorageStore, type FacetHierarchyValue } from '@searchspring/snap-store-mobx';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModelFacet, SearchResponseModelFacetValueAllOf } from '@searchspring/snapi-types';
import { QueryStringTranslator, reactLinker, UrlManager } from '@searchspring/snap-url-manager';

const mockData = new MockData();
const hierarchyFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = mockData
	.search()
	.facets!.filter((facet) => facet.field == 'ss_category_hierarchy')!
	.pop()!;
mockData.updateConfig({ search: 'filteredHierarchy' });
const hierarchyFacetFilteredMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = mockData
	.search()
	.facets!.filter((facet) => facet.field == 'ss_category_hierarchy')!
	.pop()!;

describe('hierarchyValue Component', () => {
	let hierarchyValueComponent: RenderResult;
	beforeEach(() => {
		hierarchyValueComponent = render(<FacetHierarchyOptions values={hierarchyFacetFilteredMock.values as FacetHierarchyValue[]} />);
	});

	it('renders', () => {
		const hierarchyValueElement = hierarchyValueComponent.container.querySelector('.ss__facet-hierarchy-options');
		expect(hierarchyValueElement).toBeInTheDocument();
	});

	it('renders label and count', () => {
		const hierarchyOption = hierarchyValueComponent.container.querySelectorAll('.ss__facet-hierarchy-options__option');

		expect(hierarchyOption).toHaveLength(hierarchyFacetFilteredMock.values!.length);

		hierarchyOption.forEach((option: Element, index: number) => {
			expect(option).toHaveTextContent(hierarchyFacetFilteredMock.values![index].label!);

			//@ts-ignore
			if (hierarchyFacetFilteredMock.values![index].history) {
				if (hierarchyFacetFilteredMock.values![index].filtered) {
					expect(option).toHaveClass('ss__facet-hierarchy-options__option--filtered');
				} else {
					expect(option).toHaveClass('ss__facet-hierarchy-options__option--return');
				}
			}
		});
	});
});

describe('hierarchyValue Component hiding count', () => {
	let hierarchyValueComponent: RenderResult;
	beforeEach(() => {
		hierarchyValueComponent = render(<FacetHierarchyOptions hideCount={true} values={hierarchyFacetMock.values as FacetHierarchyValue[]} />);
	});

	it('renders', () => {
		const hierarchyValueElement = hierarchyValueComponent.container.querySelector('.ss__facet-hierarchy-options');
		expect(hierarchyValueElement).toBeInTheDocument();
	});

	it('doesnt render checkboxs', () => {
		const checkbox = hierarchyValueComponent.container.querySelector('.ss__checkbox');
		expect(checkbox).not.toBeInTheDocument();
	});

	it('renders label but not count', () => {
		const hierarchyOption = hierarchyValueComponent.container.querySelectorAll('.ss__facet-hierarchy-options__option');

		expect(hierarchyOption).toHaveLength(hierarchyFacetMock.values!.length);

		expect(hierarchyOption[0]).toHaveTextContent(hierarchyFacetMock.values![0].label!);
		expect(hierarchyOption[0]).not.toHaveTextContent(hierarchyFacetMock.values![0].count!.toString());
	});
});

describe('FacetHierarchyOptions generic props work', () => {
	it('can disable styling', () => {
		const rendered = render(<FacetHierarchyOptions values={hierarchyFacetMock.values as FacetHierarchyValue[]} disableStyles={true} />);

		const hierarchyOption = rendered.container.querySelector('.ss__facet-hierarchy-options');
		expect(hierarchyOption?.classList.length).toBe(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<FacetHierarchyOptions values={hierarchyFacetMock.values as FacetHierarchyValue[]} className={className} />);

		const hierarchyOption = rendered.container.querySelector('.ss__facet-hierarchy-options');
		expect(hierarchyOption).toBeInTheDocument();
		expect(hierarchyOption).toHaveClass(className);
	});

	it('can set custom return icon', async () => {
		mockData.updateConfig({ search: 'filteredHierarchy' });
		const mockTestData = mockData.searchMeta();
		const facetStore = new SearchFacetStore({
			config: { id: 'testing' },
			stores: { storage: new StorageStore() },
			services: { urlManager: new UrlManager(new QueryStringTranslator(), reactLinker) },
			data: { search: mockTestData.search, meta: mockTestData.meta },
		});

		const rendered = render(
			<FacetHierarchyOptions facet={facetStore.filter((facet) => facet.field == 'ss_category_hierarchy').pop()} returnIcon={'cog'} />
		);
		const firstOption = rendered.container.querySelector('.ss__facet-hierarchy-options__option');
		userEvent.click(firstOption!);

		await waitFor(() => {
			const returnIcon = rendered.container.querySelector('.ss__facet-hierarchy-options__option--return .ss__icon--cog');
			expect(returnIcon).toBeInTheDocument();
		});
	});

	it('can set custom onClick func', async () => {
		const onClickFunc = jest.fn();
		const rendered = render(<FacetHierarchyOptions values={hierarchyFacetMock.values as FacetHierarchyValue[]} onClick={onClickFunc} />);

		const hierarchyOption = rendered.container.querySelector('.ss__facet-hierarchy-options__option')!;
		expect(hierarchyOption).toBeInTheDocument();
		await userEvent.click(hierarchyOption);
		expect(onClickFunc).toHaveBeenCalled();
	});
});

describe('facetHierarchyOption lang works', () => {
	const selector = '.ss__facet-hierarchy-options';

	it('immediately available lang options', async () => {
		const langOptions = ['hierarchyOption'];

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
				const rendered = render(<FacetHierarchyOptions lang={lang} values={hierarchyFacetMock.values as FacetValue[]} />);

				const element = rendered.container.querySelector(selector);
				expect(element).toBeInTheDocument();
				const langElem = rendered.container.querySelector(`[ss-lang=${option}]`);

				expect(langElem).toBeInTheDocument();
				if (typeof langObj.value == 'function') {
					expect(langElem?.innerHTML).toBe(value);

					hierarchyFacetMock.values?.forEach((val, idx) => {
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

describe('FacetHierarchyOptions theming works', () => {
	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				facetHierarchyOptions: {
					hideCount: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FacetHierarchyOptions values={hierarchyFacetMock.values as FacetHierarchyValue[]} />
			</ThemeProvider>
		);
		const Element = rendered.container.querySelector('.ss__facet-hierarchy-options');
		const countElement = rendered.container.querySelector('.ss__facet-hierarchy-options__option__value__count');
		expect(Element).toBeInTheDocument();
		expect(countElement).not.toBeInTheDocument();
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				facetHierarchyOptions: {
					hideCount: true,
				},
			},
		};

		const rendered = render(<FacetHierarchyOptions values={hierarchyFacetMock.values as FacetHierarchyValue[]} theme={propTheme} />);

		const Element = rendered.container.querySelector('.ss__facet-hierarchy-options');
		const countElement = rendered.container.querySelector('.ss__facet-hierarchy-options__option__value__count');
		expect(Element).toBeInTheDocument();
		expect(countElement).not.toBeInTheDocument();
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				facetHierarchyOptions: {
					hideCount: true,
				},
			},
		};
		const propTheme = {
			components: {
				facetHierarchyOptions: {
					hideCount: false,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FacetHierarchyOptions values={hierarchyFacetMock.values as FacetHierarchyValue[]} theme={propTheme} />
			</ThemeProvider>
		);

		const Element = rendered.container.querySelector('.ss__facet-hierarchy-options');
		const countElement = rendered.container.querySelector('.ss__facet-hierarchy-options__option__value__count');
		expect(Element).toBeInTheDocument();
		expect(countElement).toBeInTheDocument();
	});
});

import { h } from 'preact';
import { render, RenderResult } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../providers';

import { FacetListOptions } from './FacetListOptions';
import { SearchFacetStore, StorageStore, type FacetValue } from '@searchspring/snap-store-mobx';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModelFacet, SearchResponseModelFacetValueAllOf } from '@searchspring/snapi-types';
import { QueryStringTranslator, reactLinker, UrlManager } from '@searchspring/snap-url-manager';

const mockData = new MockData();
const listFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = mockData
	.search()
	.facets!.filter((facet) => facet.type == 'value')!
	.pop()!;

describe('ListValue Component', () => {
	let listValueComponent: RenderResult;
	beforeEach(() => {
		listValueComponent = render(<FacetListOptions values={listFacetMock.values as FacetValue[]} />);
	});

	it('renders', () => {
		const listValueElement = listValueComponent.container.querySelector('.ss__facet-list-options');
		expect(listValueElement).toBeInTheDocument();
	});

	it('renders label and count', () => {
		const listOption = listValueComponent.container.querySelectorAll('.ss__facet-list-options__option');

		expect(listOption).toHaveLength(listFacetMock.values!.length);

		expect(listOption[0]).toHaveTextContent(listFacetMock.values![0].label!);

		const optionCount = listOption[0].querySelector('.ss__facet-list-options__option__value__count');
		expect(optionCount).toHaveTextContent(listFacetMock.values![0].count!.toString());
	});

	it('renders checkboxs', () => {
		const checkbox = listValueComponent.container.querySelector('.ss__checkbox');
		expect(checkbox).toBeInTheDocument();
	});
});

describe('ListValue Component hiding checkbox and count', () => {
	let listValueComponent: RenderResult;
	beforeEach(() => {
		listValueComponent = render(<FacetListOptions hideCheckbox={true} hideCount={true} values={listFacetMock.values as FacetValue[]} />);
	});

	it('renders', () => {
		const listValueElement = listValueComponent.container.querySelector('.ss__facet-list-options');
		expect(listValueElement).toBeInTheDocument();
	});

	it('doesnt render checkboxs', () => {
		const checkbox = listValueComponent.container.querySelector('.ss__checkbox');
		expect(checkbox).not.toBeInTheDocument();
	});

	it('renders label but not count', () => {
		const listOption = listValueComponent.container.querySelectorAll('.ss__facet-list-options__option');

		expect(listOption).toHaveLength(listFacetMock.values!.length);

		expect(listOption[0]).toHaveTextContent(listFacetMock.values![0].label!);
		expect(listOption[0]).not.toHaveTextContent(listFacetMock.values![0].count!.toString());
	});
});

describe('can use respectSingleSelect to render radios', () => {
	let radioComponent: RenderResult;
	let checkboxComponent: RenderResult;

	const mockTestData = mockData.searchMeta();
	const facetStore = new SearchFacetStore({
		config: { id: 'testing' },
		stores: { storage: new StorageStore() },
		services: { urlManager: new UrlManager(new QueryStringTranslator(), reactLinker) },
		data: { search: mockTestData.search, meta: mockTestData.meta },
	});

	beforeEach(() => {
		radioComponent = render(<FacetListOptions respectSingleSelect={true} facet={facetStore.filter((facet) => facet.multiple == 'single').pop()} />);
		checkboxComponent = render(<FacetListOptions respectSingleSelect={true} facet={facetStore.filter((facet) => facet.multiple == 'or').pop()} />);
	});

	it('renders', () => {
		const listValueElement = checkboxComponent.container.querySelector('.ss__facet-list-options');
		expect(listValueElement).toBeInTheDocument();

		const radioComponentElement = radioComponent.container.querySelector('.ss__facet-list-options');
		expect(radioComponentElement).toBeInTheDocument();
	});

	it('renders checkbox or radio', () => {
		const checkbox = checkboxComponent.container.querySelector('.ss__checkbox');
		const noRadio = checkboxComponent.container.querySelector('.ss__radio');
		expect(noRadio).not.toBeInTheDocument();
		expect(checkbox).toBeInTheDocument();

		const radio = radioComponent.container.querySelector('.ss__radio');
		const noCheckbox = radioComponent.container.querySelector('.ss__checkbox');
		expect(radio).toBeInTheDocument();
		expect(noCheckbox).not.toBeInTheDocument();
	});
});

describe('FacetListOptions generic props work', () => {
	it('can hide count parenthesis', () => {
		const rendered = render(<FacetListOptions values={listFacetMock.values as FacetValue[]} hideCountParenthesis={true} />);

		const listOption = rendered.container.querySelectorAll('.ss__facet-list-options__option');

		expect(listOption).toHaveLength(listFacetMock.values!.length);

		expect(listOption[0]).toHaveTextContent(listFacetMock.values![0].label!);

		const optionCount = listOption[0].querySelector('.ss__facet-list-options__option__value__count');
		expect(optionCount).toHaveTextContent(listFacetMock.values![0].count!.toString());
		expect(optionCount).not.toHaveTextContent('(');
		expect(optionCount).not.toHaveTextContent(')');
	});

	it('can disable styling', () => {
		const rendered = render(<FacetListOptions values={listFacetMock.values as FacetValue[]} disableStyles={true} />);

		const listOption = rendered.container.querySelector('.ss__facet-list-options');
		expect(listOption?.classList.length).toBe(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<FacetListOptions values={listFacetMock.values as FacetValue[]} className={className} />);

		const listOption = rendered.container.querySelector('.ss__facet-list-options');
		expect(listOption).toBeInTheDocument();
		expect(listOption).toHaveClass(className);
	});

	it('can set custom onClick func', async () => {
		const onClickFunc = jest.fn();
		const rendered = render(<FacetListOptions values={listFacetMock.values as FacetValue[]} onClick={onClickFunc} />);

		const listOption = rendered.container.querySelector('.ss__facet-list-options__option')!;
		expect(listOption).toBeInTheDocument();
		await userEvent.click(listOption);
		expect(onClickFunc).toHaveBeenCalled();
	});
});

describe('FacetListOptions lang works', () => {
	const selector = '.ss__facet-list-options';

	it('immediately available lang options', async () => {
		const langOptions = ['listOption'];

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
				const rendered = render(<FacetListOptions lang={lang} values={listFacetMock.values as FacetValue[]} />);

				const element = rendered.container.querySelector(selector);
				expect(element).toBeInTheDocument();
				const langElem = rendered.container.querySelector(`[ss-lang=${option}]`);

				expect(langElem).toBeInTheDocument();
				if (typeof langObj.value == 'function') {
					expect(langElem?.innerHTML).toBe(value);

					listFacetMock.values?.forEach((val, idx) => {
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

describe('FacetListOptions theming works', () => {
	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				facetListOptions: {
					hideCount: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FacetListOptions values={listFacetMock.values as FacetValue[]} />
			</ThemeProvider>
		);
		const Element = rendered.container.querySelector('.ss__facet-list-options');
		const countElement = rendered.container.querySelector('.ss__facet-list-options__option__value__count');
		expect(Element).toBeInTheDocument();
		expect(countElement).not.toBeInTheDocument();
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				facetListOptions: {
					hideCount: true,
				},
			},
		};

		const rendered = render(<FacetListOptions values={listFacetMock.values as FacetValue[]} theme={propTheme} />);

		const Element = rendered.container.querySelector('.ss__facet-list-options');
		const countElement = rendered.container.querySelector('.ss__facet-list-options__option__value__count');
		expect(Element).toBeInTheDocument();
		expect(countElement).not.toBeInTheDocument();
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				facetListOptions: {
					hideCount: true,
				},
			},
		};
		const propTheme = {
			components: {
				facetListOptions: {
					hideCount: false,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FacetListOptions values={listFacetMock.values as FacetValue[]} theme={propTheme} />
			</ThemeProvider>
		);

		const Element = rendered.container.querySelector('.ss__facet-list-options');
		const countElement = rendered.container.querySelector('.ss__facet-list-options__option__value__count');
		expect(Element).toBeInTheDocument();
		expect(countElement).toBeInTheDocument();
	});
});

import { h } from 'preact';
import { render, RenderResult } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../providers';

import { FacetListOptions } from './FacetListOptions';
import type { FacetValue } from '@searchspring/snap-store-mobx';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModelFacet, SearchResponseModelFacetValueAllOf } from '@searchspring/snapi-types';

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

	it('can set custom onClick func', () => {
		const onClickFunc = jest.fn();
		const rendered = render(<FacetListOptions values={listFacetMock.values as FacetValue[]} onClick={onClickFunc} />);

		const listOption = rendered.container.querySelector('.ss__facet-list-options__option')!;
		expect(listOption).toBeInTheDocument();
		userEvent.click(listOption);
		expect(onClickFunc).toHaveBeenCalled();
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

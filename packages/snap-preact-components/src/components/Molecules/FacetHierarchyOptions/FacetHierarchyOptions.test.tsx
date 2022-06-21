import { h } from 'preact';
import { render, RenderResult } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../../providers';

import { FacetHierarchyOptions } from './FacetHierarchyOptions';
import { hierarchyFacetMock, hierarchyFacetFilteredMock } from '../../../mocks/searchResponse';
import type { HierarchyValue } from '@searchspring/snap-store-mobx';

describe('hierarchyValue Component', () => {
	let hierarchyValueComponent: RenderResult;
	beforeEach(() => {
		hierarchyValueComponent = render(<FacetHierarchyOptions values={hierarchyFacetFilteredMock.values as HierarchyValue[]} />);
	});

	it('renders', () => {
		const hierarchyValueElement = hierarchyValueComponent.container.querySelector('.ss__facet-hierarchy-options');
		expect(hierarchyValueElement).toBeInTheDocument();
	});

	it('renders label and count', () => {
		const hierarchyOption = hierarchyValueComponent.container.querySelectorAll('.ss__facet-hierarchy-options__option');

		expect(hierarchyOption).toHaveLength(hierarchyFacetFilteredMock.values.length);

		hierarchyOption.forEach((option: Element, index: number) => {
			expect(option).toHaveTextContent(hierarchyFacetFilteredMock.values[index].label);

			if (hierarchyFacetFilteredMock.values[index].history) {
				if (hierarchyFacetFilteredMock.values[index].filtered) {
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
		hierarchyValueComponent = render(<FacetHierarchyOptions hideCount={true} values={hierarchyFacetMock.values as HierarchyValue[]} />);
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

		expect(hierarchyOption).toHaveLength(hierarchyFacetMock.values.length);

		expect(hierarchyOption[0]).toHaveTextContent(hierarchyFacetMock.values[0].label);
		expect(hierarchyOption[0]).not.toHaveTextContent(hierarchyFacetMock.values[0].count.toString());
	});
});

describe('FacetHierarchyOptions generic props work', () => {
	it('can disable styling', () => {
		const rendered = render(<FacetHierarchyOptions values={hierarchyFacetMock.values as HierarchyValue[]} disableStyles={true} />);

		const hierarchyOption = rendered.container.querySelector('.ss__facet-hierarchy-options');
		expect(hierarchyOption?.classList.length).toBe(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<FacetHierarchyOptions values={hierarchyFacetMock.values as HierarchyValue[]} className={className} />);

		const hierarchyOption = rendered.container.querySelector('.ss__facet-hierarchy-options');
		expect(hierarchyOption).toBeInTheDocument();
		expect(hierarchyOption).toHaveClass(className);
	});

	it('can set custom onClick func', () => {
		const onClickFunc = jest.fn();
		const rendered = render(<FacetHierarchyOptions values={hierarchyFacetMock.values as HierarchyValue[]} onClick={onClickFunc} />);

		const hierarchyOption = rendered.container.querySelector('.ss__facet-hierarchy-options__option')!;
		expect(hierarchyOption).toBeInTheDocument();
		userEvent.click(hierarchyOption);
		expect(onClickFunc).toHaveBeenCalled();
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
				<FacetHierarchyOptions values={hierarchyFacetMock.values as HierarchyValue[]} />
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

		const rendered = render(<FacetHierarchyOptions values={hierarchyFacetMock.values as HierarchyValue[]} theme={propTheme} />);

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
				<FacetHierarchyOptions values={hierarchyFacetMock.values as HierarchyValue[]} theme={propTheme} />
			</ThemeProvider>
		);

		const Element = rendered.container.querySelector('.ss__facet-hierarchy-options');
		const countElement = rendered.container.querySelector('.ss__facet-hierarchy-options__option__value__count');
		expect(Element).toBeInTheDocument();
		expect(countElement).toBeInTheDocument();
	});
});

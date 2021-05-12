import { h } from 'preact';
import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers/theme';

import { FacetHierarchyOptions } from './FacetHierarchyOptions';
import { hierarchyFacetMock, hierarchyFacetFilteredMock } from '../../../mocks/searchResponse';

describe('hierarchyValue Component', () => {
	let hierarchyValueComponent;
	beforeEach(() => {
		hierarchyValueComponent = render(<FacetHierarchyOptions values={hierarchyFacetMock.values} />);
	});

	it('renders', () => {
		const hierarchyValueElement = hierarchyValueComponent.container.querySelector('.ss-hierarchy');
		expect(hierarchyValueElement).toBeInTheDocument();
	});

	it('renders label and count', () => {
		const hierarchyOption = hierarchyValueComponent.container.querySelectorAll('.ss-hierarchy__option');

		expect(hierarchyOption).toHaveLength(hierarchyFacetMock.values.length);

		expect(hierarchyOption[0]).toHaveTextContent(hierarchyFacetMock.values[0].label);
		expect(hierarchyOption[0]).toHaveTextContent(hierarchyFacetMock.values[0].count.toString());
	});
});

describe('hierarchyValue Component', () => {
	let hierarchyValueComponent;
	beforeEach(() => {
		hierarchyValueComponent = render(<FacetHierarchyOptions values={hierarchyFacetFilteredMock.values} />);
	});

	it('renders', () => {
		const hierarchyValueElement = hierarchyValueComponent.container.querySelector('.ss-hierarchy');
		expect(hierarchyValueElement).toBeInTheDocument();
	});

	it('renders label and count', () => {
		const hierarchyOption = hierarchyValueComponent.container.querySelectorAll('.ss-hierarchy__option');

		expect(hierarchyOption).toHaveLength(hierarchyFacetFilteredMock.values.length);

		hierarchyOption.forEach((option, index) => {
			expect(option).toHaveTextContent(hierarchyFacetFilteredMock.values[index].label);

			if (hierarchyFacetFilteredMock.values[index].history) {
				if (hierarchyFacetFilteredMock.values[index].filtered) {
					expect(option).toHaveClass('ss-hierarchy__option-filtered');
				} else {
					expect(option).toHaveClass('ss-hierarchy__option-return');
				}
			}
		});
	});
});

describe('hierarchyValue Component hiding count', () => {
	let hierarchyValueComponent;
	beforeEach(() => {
		hierarchyValueComponent = render(<FacetHierarchyOptions hideCount={true} values={hierarchyFacetMock.values} />);
	});

	it('renders', () => {
		const hierarchyValueElement = hierarchyValueComponent.container.querySelector('.ss-hierarchy');
		expect(hierarchyValueElement).toBeInTheDocument();
	});

	it('doesnt render checkboxs', () => {
		const checkbox = hierarchyValueComponent.container.querySelector('.ss-checkbox');
		expect(checkbox).not.toBeInTheDocument();
	});

	it('renders label but not count', () => {
		const hierarchyOption = hierarchyValueComponent.container.querySelectorAll('.ss-hierarchy__option');

		expect(hierarchyOption).toHaveLength(hierarchyFacetMock.values.length);

		expect(hierarchyOption[0]).toHaveTextContent(hierarchyFacetMock.values[0].label);
		expect(hierarchyOption[0]).not.toHaveTextContent(hierarchyFacetMock.values[0].count.toString());
	});
});

describe('FacetHierarchyOptions theming works', () => {
	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				FacetHierarchyOptions: {
					hideCount: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FacetHierarchyOptions values={hierarchyFacetMock.values} />
			</ThemeProvider>
		);
		const Element = rendered.container.querySelector('.ss-hierarchy');
		const countElement = rendered.container.querySelector('.ss-facetCount');
		expect(Element).toBeInTheDocument();
		expect(countElement).not.toBeInTheDocument();
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				FacetHierarchyOptions: {
					hideCount: true,
				},
			},
		};

		const rendered = render(<FacetHierarchyOptions values={hierarchyFacetMock.values} theme={propTheme} />);

		const Element = rendered.container.querySelector('.ss-hierarchy');
		const countElement = rendered.container.querySelector('.ss-facetCount');
		expect(Element).toBeInTheDocument();
		expect(countElement).not.toBeInTheDocument();
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				FacetHierarchyOptions: {
					hideCount: true,
				},
			},
		};
		const propTheme = {
			components: {
				FacetHierarchyOptions: {
					hideCount: false,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FacetHierarchyOptions values={hierarchyFacetMock.values} theme={propTheme} />
			</ThemeProvider>
		);

		const Element = rendered.container.querySelector('.ss-hierarchy');
		const countElement = rendered.container.querySelector('.ss-hierarchy__option__value__count');
		expect(Element).toBeInTheDocument();
		expect(countElement).toBeInTheDocument();
	});
});

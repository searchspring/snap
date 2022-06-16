import { h } from 'preact';

import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { FacetGridOptions } from './FacetGridOptions';
import { gridFacetMock } from '../../../mocks/searchResponse';
import { Value } from '@searchspring/snap-store-mobx';

describe('FacetGridOptions Component', () => {
	let gridComponent;
	let gridElement;

	it('renders', () => {
		gridComponent = render(<FacetGridOptions values={gridFacetMock.values as unknown as Value[]} />);

		gridElement = gridComponent.container.querySelector('.ss__facet-grid-options');

		expect(gridElement).toBeInTheDocument();
		expect(gridElement).toHaveTextContent(gridFacetMock.values[0].label);
	});

	it('has the correct number of options', () => {
		gridComponent = render(<FacetGridOptions values={gridFacetMock.values as unknown as Value[]} />);

		const gridOptions = gridComponent.container.querySelectorAll('.ss__facet-grid-options__option');
		expect(gridOptions).toHaveLength(gridFacetMock.values.length);
	});

	it('has the correct label', () => {
		gridComponent = render(<FacetGridOptions values={gridFacetMock.values as unknown as Value[]} />);

		const gridOptions = gridComponent.container.querySelectorAll('.ss__facet-grid-options__option__value');
		for (let i = 0; i < gridOptions.length; i++) {
			expect(gridOptions[i]).toHaveTextContent(gridFacetMock.values[i].label);
		}
	});

	it('Grid container element has correct number of classes', () => {
		gridComponent = render(<FacetGridOptions values={gridFacetMock.values as unknown as Value[]} />);

		gridElement = gridComponent.container.querySelector('.ss__facet-grid-options');

		expect(gridElement!.classList.length).toBe(2);
		expect(gridElement).toHaveClass('ss__facet-grid-options');
	});

	it('Grid option elements have correct classes', () => {
		gridComponent = render(<FacetGridOptions values={gridFacetMock.values as unknown as Value[]} />);

		const gridOptionsElement = gridComponent.container.querySelectorAll('.ss__facet-grid-options__option__value');
		const inactiveGridOption = gridOptionsElement[0];
		const activeGridOption = gridOptionsElement[2];
		expect(inactiveGridOption).toHaveClass('ss__facet-grid-options__option__value');
		expect(activeGridOption!.parentElement).toHaveClass('ss__facet-grid-options__option--filtered');
	});

	it('Grid option can adjust gapSize & columns', () => {
		const args = {
			gapSize: '10px',
			columns: 2,
		};

		const rendered = render(<FacetGridOptions values={gridFacetMock.values as unknown as Value[]} {...args} />);

		const gridOptionsElement = rendered.container.querySelector('.ss__facet-grid-options');

		const styles = getComputedStyle(gridOptionsElement!);
		expect(styles!.gridTemplateColumns).toBe(`repeat(${args.columns}, 1fr)`);
		expect(styles!.gap).toBe(args.gapSize);
	});

	it('can disable styling', () => {
		const rendered = render(<FacetGridOptions values={gridFacetMock.values as unknown as Value[]} disableStyles={true} />);

		const gridElement = rendered.container.querySelector('.ss__facet-grid-options');
		expect(gridElement!.classList.length).toBe(1);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<FacetGridOptions values={gridFacetMock.values as unknown as Value[]} className={className} />);

		const gridElement = rendered.container.querySelector('.ss__facet-grid-options');
		expect(gridElement).toBeInTheDocument();
		expect(gridElement).toHaveClass(className);
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
				<FacetGridOptions values={gridFacetMock.values as unknown as Value[]} />
			</ThemeProvider>
		);
		const gridElement = rendered.container.querySelector('.ss__facet-grid-options');
		const styles = getComputedStyle(gridElement!);
		expect(styles!.gap).toBe(globalTheme.components.facetGridOptions.gapSize);
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
		const rendered = render(<FacetGridOptions values={gridFacetMock.values as unknown as Value[]} theme={propTheme} />);
		const gridElement = rendered.container.querySelector('.ss__facet-grid-options');
		const styles = getComputedStyle(gridElement!);
		expect(styles!.gap).toBe(propTheme.components.facetGridOptions.gapSize);
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
				<FacetGridOptions values={gridFacetMock.values as unknown as Value[]} theme={propTheme} />
			</ThemeProvider>
		);
		const gridElement = rendered.container.querySelector('.ss__facet-grid-options');
		const styles = getComputedStyle(gridElement!);
		expect(styles!.gap).toBe(propTheme.components.facetGridOptions.gapSize);
		expect(gridElement).toBeInTheDocument();
	});
});

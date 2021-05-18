import { h } from 'preact';
import { render } from '@testing-library/preact';

import { ThemeProvider } from '../../../providers/theme';

import { FilterSummary } from './FilterSummary';
import { filters } from '../../../mocks/store';

describe('FilterSummary Component', () => {
	it('renders with filter list', () => {
		const rendered = render(<FilterSummary filters={filters} />);
		const FilterSummaryElement = rendered.container.querySelector('.ss__filter-summary');
		const FilterElements = rendered.container.querySelectorAll('.ss__filter:not(.ss__filter-summary__clear-all)');

		expect(FilterSummaryElement).toBeInTheDocument();
		expect(FilterElements.length).toBe(3);
	});

	it('renders clearAll Button', () => {
		const rendered = render(<FilterSummary filters={filters} />);
		const clearAllButton = rendered.container.querySelector('.ss__filter-summary__clear-all');
		expect(clearAllButton).toBeInTheDocument();
		expect(clearAllButton).toHaveTextContent('Clear All');
	});

	it('custom clearAll Button', () => {
		const clearLabel = 'start over';
		const rendered = render(<FilterSummary filters={filters} clearAllLabel={clearLabel} />);
		const clearAllButton = rendered.container.querySelector('.ss__filter-summary__clear-all');

		expect(clearAllButton).toBeInTheDocument();
		expect(clearAllButton).toHaveTextContent(clearLabel);
	});

	it('hides clearAll Button', () => {
		const rendered = render(<FilterSummary filters={filters} hideClearAll />);
		const clearAllButton = rendered.container.querySelector('.ss__filter-summary__clear-all');
		expect(clearAllButton).not.toBeInTheDocument();
	});

	it('renders a default title', () => {
		const rendered = render(<FilterSummary filters={filters} />);
		const title = rendered.container.querySelector('.ss__filter-summary__title');
		expect(title).toBeInTheDocument();
		expect(title).toHaveTextContent('Current Filters');
	});

	it('renders a custom title', () => {
		const rendered = render(<FilterSummary filters={filters} title={'you clicked these earlier'} />);
		const title = rendered.container.querySelector('.ss__filter-summary__title');
		expect(title).toBeInTheDocument();
		expect(title).toHaveTextContent('you clicked these earlier');
	});

	it('can hide the facet label', () => {
		const rendered = render(<FilterSummary filters={filters} hideFacetLabel={true} />);
		const facetLabel = rendered.container.querySelector('.ss__filter__label');
		expect(facetLabel).not.toBeInTheDocument();
	});

	it('does not render if no filters', () => {
		const rendered = render(<FilterSummary filters={[]} />);
		const FilterElement = rendered.container.querySelector('.ss__filter-summary');

		expect(FilterElement).not.toBeInTheDocument();
	});
});

describe('FilterSummary theming works', () => {
	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				filterSummary: {
					title: 'Lorem Ipsum',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FilterSummary filters={filters} />
			</ThemeProvider>
		);
		const element = rendered.container.querySelector('.ss__filter-summary');
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent(globalTheme.components.filterSummary.title);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				filterSummary: {
					title: 'Lorem Ipsum',
				},
			},
		};
		const rendered = render(<FilterSummary filters={filters} theme={propTheme} />);
		const element = rendered.container.querySelector('.ss__filter-summary');
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent(propTheme.components.filterSummary.title);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				filterSummary: {
					title: 'shouldnt find this',
				},
			},
		};
		const propTheme = {
			components: {
				filterSummary: {
					title: 'should find this',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FilterSummary filters={filters} theme={propTheme} />
			</ThemeProvider>
		);

		const element = rendered.container.querySelector('.ss__filter-summary');
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent(propTheme.components.filterSummary.title);
		expect(element).not.toHaveTextContent(globalTheme.components.filterSummary.title);
	});
});

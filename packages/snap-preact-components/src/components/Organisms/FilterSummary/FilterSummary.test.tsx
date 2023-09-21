import { h } from 'preact';
import { render } from '@testing-library/preact';

import { ThemeProvider } from '../../../providers';
import { FilterSummary } from './FilterSummary';
import userEvent from '@testing-library/user-event';

import { MockData } from '@searchspring/snap-shared';
import { SearchFilterStore } from '@searchspring/snap-store-mobx';
import { UrlManager, UrlTranslator } from '@searchspring/snap-url-manager';

describe('FilterSummary Component', () => {
	const services = {
		urlManager: new UrlManager(new UrlTranslator()),
	};
	const mockData = new MockData().searchMeta('filtered');
	const filters = new SearchFilterStore(services, mockData.filters!, mockData.meta);

	it('renders with filter list', () => {
		const rendered = render(<FilterSummary filters={filters} />);
		const FilterSummaryElement = rendered.container.querySelector('.ss__filter-summary');
		const FilterElements = rendered.container.querySelectorAll('.ss__filter:not(.ss__filter-summary__clear-all)');

		expect(FilterSummaryElement).toBeInTheDocument();
		expect(FilterElements.length).toBe(3);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders clearAll Button', () => {
		const rendered = render(<FilterSummary filters={filters} />);
		const clearAllButton = rendered.container.querySelector('.ss__filter-summary__clear-all');
		expect(clearAllButton).toBeInTheDocument();
		expect(clearAllButton).toHaveTextContent('Clear All');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('custom clearAll Button', () => {
		const clearLabel = 'start over';
		const rendered = render(<FilterSummary filters={filters} clearAllLabel={clearLabel} />);
		const clearAllButton = rendered.container.querySelector('.ss__filter-summary__clear-all');

		expect(clearAllButton).toBeInTheDocument();
		expect(clearAllButton).toHaveTextContent(clearLabel);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('hides clearAll Button', () => {
		const rendered = render(<FilterSummary filters={filters} hideClearAll />);
		const clearAllButton = rendered.container.querySelector('.ss__filter-summary__clear-all');
		expect(clearAllButton).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders a default title', () => {
		const rendered = render(<FilterSummary filters={filters} />);
		const title = rendered.container.querySelector('.ss__filter-summary__title');
		expect(title).toBeInTheDocument();
		expect(title).toHaveTextContent('Current Filters');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders a custom title', () => {
		const rendered = render(<FilterSummary filters={filters} title={'you clicked these earlier'} />);
		const title = rendered.container.querySelector('.ss__filter-summary__title');
		expect(title).toBeInTheDocument();
		expect(title).toHaveTextContent('you clicked these earlier');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with specified icons', async () => {
		const args = {
			filters: filters,
			clearAllIcon: 'circle',
			filterIcon: 'check',
		};

		const rendered = render(<FilterSummary {...args} />);

		const filterIcon = rendered.container.querySelector('.ss__filter-summary .ss__filter .ss__icon');
		const clearAllIcon = rendered.container.querySelector('.ss__filter-summary__clear-all .ss__icon');

		expect(filterIcon).toHaveClass(`ss__icon--${args.filterIcon}`);
		expect(clearAllIcon).toHaveClass(`ss__icon--${args.clearAllIcon}`);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can hide the facet label', () => {
		const rendered = render(<FilterSummary filters={filters} hideFacetLabel={true} />);
		const facetLabel = rendered.container.querySelector('.ss__filter__label');
		expect(facetLabel).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('does not render if no filters', () => {
		const rendered = render(<FilterSummary filters={[]} />);
		const FilterElement = rendered.container.querySelector('.ss__filter-summary');

		expect(FilterElement).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with custom seperator', () => {
		const sep = '>>>';
		const rendered = render(<FilterSummary filters={filters} separator={sep} />);
		const FilterElement = rendered.container.querySelector('.ss__filter-summary');

		expect(FilterElement).toBeInTheDocument();
		const seperatorElem = rendered.container.querySelector('.ss__filter__label__separator');

		expect(seperatorElem).toHaveTextContent(sep);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with custom onclick func', () => {
		const onclickfunc = jest.fn();

		const rendered = render(<FilterSummary filters={filters} onClick={onclickfunc} />);
		const FilterSumElement = rendered.container.querySelector('.ss__filter-summary');

		expect(FilterSumElement).toBeInTheDocument();
		const filter = rendered.container.querySelector('.ss__filter-summary .ss__filter')!;

		expect(filter).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();

		userEvent.click(filter);

		expect(onclickfunc).toHaveBeenCalled();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with custom on clear all click func', () => {
		const onclickfunc = jest.fn();

		const rendered = render(<FilterSummary filters={filters} onClearAllClick={onclickfunc} />);
		const FilterSumElement = rendered.container.querySelector('.ss__filter-summary');

		expect(FilterSumElement).toBeInTheDocument();
		const filter = rendered.container.querySelector('.ss__filter-summary .ss__filter-summary__clear-all')!;

		expect(filter).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();

		userEvent.click(filter);

		expect(onclickfunc).toHaveBeenCalled();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with classname', () => {
		const args = {
			className: 'classy',
		};

		const rendered = render(<FilterSummary filters={filters} {...args} />);

		const facetsElement = rendered.container.querySelector('.ss__filter-summary');
		expect(facetsElement).toHaveClass(args.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('disables styles', () => {
		const args = {
			disableStyles: true,
		};

		const rendered = render(<FilterSummary filters={filters} {...args} />);

		const facetsElement = rendered.container.querySelector('.ss__filter-summary');
		expect(facetsElement?.classList).toHaveLength(1);
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});

describe('FilterSummary theming works', () => {
	const services = {
		urlManager: new UrlManager(new UrlTranslator()),
	};
	const mockData = new MockData().searchMeta('filtered');
	const filters = new SearchFilterStore(services, mockData.filters!, mockData.meta);

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
		expect(rendered.asFragment()).toMatchSnapshot();
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
		expect(rendered.asFragment()).toMatchSnapshot();
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
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});

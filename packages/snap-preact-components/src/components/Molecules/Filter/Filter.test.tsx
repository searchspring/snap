import { h } from 'preact';

import { ThemeProvider } from '../../../providers';

import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { Filter } from './Filter';
import { UrlManager, UrlTranslator, reactLinker } from '@searchspring/snap-url-manager';
import { MockData } from '@searchspring/snap-shared';
import { SearchFilterStore } from '@searchspring/snap-store-mobx';

describe('Filter Component', () => {
	const args = {
		facetLabel: 'facet',
		valueLabel: 'value',
	};

	const services = {
		urlManager: new UrlManager(new UrlTranslator()),
	};
	const mockData = new MockData().searchMeta('filtered');

	it('renders', () => {
		const rendered = render(<Filter {...args} />);

		const filterElement = rendered.container.querySelector('.ss__filter');

		expect(filterElement).toBeInTheDocument();

		const facetTextElement = rendered.getByText(args.facetLabel);
		const valueTextElement = rendered.getByText(args.valueLabel);
		const iconElement = rendered.container.querySelector('.ss__icon');

		expect(filterElement?.classList).toHaveLength(2);

		expect(facetTextElement).toBeInTheDocument();
		expect(facetTextElement).toHaveClass('ss__filter__label');

		expect(valueTextElement).toBeInTheDocument();
		expect(valueTextElement).toHaveClass('ss__filter__value');

		expect(iconElement).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with Filter prop data', () => {
		const filters = new SearchFilterStore(services, mockData.filters!, mockData.meta);
		const filter = filters[0];
		const rendered = render(<Filter filter={filter} />);

		const filterElement = rendered.container.querySelector('.ss__filter');

		expect(filterElement).toBeInTheDocument();

		const facetTextElement = rendered.getByText(filter.facet.label!);
		const valueTextElement = rendered.getByText(filter.value.label!);

		expect(facetTextElement).toBeInTheDocument();
		expect(valueTextElement).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with specified icon', () => {
		const icon = 'cog';
		const rendered = render(<Filter {...args} icon={icon} />);
		const filterElement = rendered.container.querySelector('.ss__filter');

		expect(filterElement).toBeInTheDocument();

		const iconElement = rendered.container.querySelector('.ss__icon');

		expect(iconElement).toBeInTheDocument();
		expect(iconElement).toHaveClass(`ss__icon--${icon}`);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has a url value when passed one', () => {
		const url = 'www.searchspring.com';
		const urlManager = new UrlManager(new UrlTranslator({ urlRoot: url }), reactLinker);

		const rendered = render(<Filter {...args} url={urlManager} />);

		const filterElement = rendered.container.querySelector('.ss__filter');

		expect(filterElement).toHaveAttribute('href', url);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('does not show facetLabel when told not to', () => {
		const rendered = render(<Filter {...args} hideFacetLabel />);

		const facetTextElement = rendered.container.querySelector('.ss__filter__label');

		expect(facetTextElement).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can use a custom separator', () => {
		const separator = 'gottakeepemseperated';
		const rendered = render(<Filter {...args} separator={separator} />);

		const separatorTextElement = rendered.container.querySelector('.ss__filter__label__separator');
		const separatorText = rendered.getByText(separator);

		expect(separatorTextElement).toBeInTheDocument();
		expect(separatorText).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can have no separator', () => {
		const separator = '';
		const rendered = render(<Filter {...args} separator={separator} />);

		const separatorTextElement = rendered.container.querySelector('.ss__filter__label__separator');

		expect(separatorTextElement).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('fires onClick prop when clicked', () => {
		const clickFn = jest.fn();

		const rendered = render(<Filter {...args} onClick={clickFn} />);

		const filterElement = rendered.container.querySelector('.ss__filter')!;

		userEvent.click(filterElement);
		expect(clickFn).toHaveBeenCalled();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Filter {...args} className={className} />);

		const filterElement = rendered.container.querySelector('.ss__filter');
		expect(filterElement).toBeInTheDocument();
		expect(filterElement).toHaveClass(className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can disable styles', () => {
		const rendered = render(<Filter {...args} disableStyles />);

		const filterElement = rendered.container.querySelector('.ss__filter');

		expect(filterElement?.classList).toHaveLength(1);
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});

describe('Filter theming works', () => {
	const args = {
		facetLabel: 'facet',
		valueLabel: 'value',
	};

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				filter: {
					separator: 'seperator',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Filter {...args} />
			</ThemeProvider>
		);
		const seperator = rendered.container.querySelector('.ss__filter__label__separator');
		expect(seperator).toBeInTheDocument();
		expect(seperator).toHaveTextContent(globalTheme.components.filter.separator);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				filter: {
					separator: 'seperator',
				},
			},
		};
		const rendered = render(<Filter {...args} theme={propTheme} />);
		const seperator = rendered.container.querySelector('.ss__filter__label__separator');
		expect(seperator).toBeInTheDocument();
		expect(seperator).toHaveTextContent(propTheme.components.filter.separator);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				filter: {
					separator: 'seperator',
				},
			},
		};
		const propTheme = {
			components: {
				filter: {
					separator: '---',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Filter {...args} theme={propTheme} />
			</ThemeProvider>
		);

		const seperator = rendered.container.querySelector('.ss__filter__label__separator');
		expect(seperator).toBeInTheDocument();
		expect(seperator).toHaveTextContent(propTheme.components.filter.separator);
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});

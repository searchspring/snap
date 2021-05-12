import { h } from 'preact';

import { ThemeProvider } from '../../../providers/theme';

import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { Filter } from './Filter';

describe('Filter Component', () => {
	const args = {
		facetLabel: 'facet',
		valueLabel: 'value',
	};

	it('renders', () => {
		const rendered = render(<Filter {...args} />);

		const filterElement = rendered.container.querySelector('.ss-filter');

		expect(filterElement).toBeInTheDocument();

		const facetTextElement = rendered.getByText(args.facetLabel);
		const valueTextElement = rendered.getByText(args.valueLabel);
		const iconElement = rendered.container.querySelector('.ss-icon');

		expect(filterElement.classList).toHaveLength(2);

		expect(facetTextElement).toBeInTheDocument();
		expect(facetTextElement).toHaveClass('ss-filter__label');

		expect(valueTextElement).toBeInTheDocument();
		expect(valueTextElement).toHaveClass('ss-filter__value');

		expect(iconElement).toBeInTheDocument();
	});

	it('renders with specified icon', () => {
		const icon = 'cog';
		const rendered = render(<Filter {...args} icon={icon} />);
		const filterElement = rendered.container.querySelector('.ss-filter');

		expect(filterElement).toBeInTheDocument();

		const iconElement = rendered.container.querySelector('.ss-icon');

		expect(iconElement).toBeInTheDocument();
		expect(iconElement).toHaveClass(`ss-icon-${icon}`);
	});

	it('has a url value when passed one', () => {
		const url = 'www.searchspring.com';

		const rendered = render(<Filter {...args} url={{ link: { href: url } }} />);

		const filterElement = rendered.container.querySelector('.ss-filter');

		expect(filterElement).toHaveAttribute('href', url);
	});

	it('does not show facetLabel when told not to', () => {
		const rendered = render(<Filter {...args} hideFacetLabel />);

		const facetTextElement = rendered.container.querySelector('.ss-filter__label');

		expect(facetTextElement).not.toBeInTheDocument();
	});

	it('can use a custom separator', () => {
		const separator = 'gottakeepemseperated';
		const rendered = render(<Filter {...args} separator={separator} />);

		const separatorTextElement = rendered.container.querySelector('.ss-filter__label__separator');
		const separatorText = rendered.getByText(separator);

		expect(separatorTextElement).toBeInTheDocument();
		expect(separatorText).toBeInTheDocument();
	});

	it('can have no separator', () => {
		const separator = '';
		const rendered = render(<Filter {...args} separator={separator} />);

		const separatorTextElement = rendered.container.querySelector('.ss-filter__label__separator');

		expect(separatorTextElement).not.toBeInTheDocument();
	});

	it('fires onClick prop when clicked', () => {
		const clickFn = jest.fn();

		const rendered = render(<Filter {...args} onClick={clickFn} />);

		const filterElement = rendered.container.querySelector('.ss-filter');

		userEvent.click(filterElement);
		expect(clickFn).toHaveBeenCalled();
	});

	it('can disable styles', () => {
		const rendered = render(<Filter {...args} disableStyles />);

		const filterElement = rendered.container.querySelector('.ss-filter');

		expect(filterElement.classList).toHaveLength(2);
		expect(filterElement.classList[1]).toMatch(/^css-0/);
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
		const seperator = rendered.container.querySelector('.ss-filter__label__separator');
		expect(seperator).toBeInTheDocument();
		expect(seperator).toHaveTextContent(globalTheme.components.filter.separator);
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
		const seperator = rendered.container.querySelector('.ss-filter__label__separator');
		expect(seperator).toBeInTheDocument();
		expect(seperator).toHaveTextContent(propTheme.components.filter.separator);
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

		const seperator = rendered.container.querySelector('.ss-filter__label__separator');
		expect(seperator).toBeInTheDocument();
		expect(seperator).toHaveTextContent(propTheme.components.filter.separator);
	});
});

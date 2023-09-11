import { h } from 'preact';

import { ThemeProvider } from '../../../providers';
import { render } from '@testing-library/preact';
import { Rating } from './Rating';

describe('Rating Component', () => {
	it('renders', () => {
		const rendered = render(<Rating value={5} />);

		const element = rendered.container.querySelector('.ss__rating');
		expect(element).toBeInTheDocument();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Rating value={5} className={className} />);

		const element = rendered.container.querySelector('.ss__rating');
		expect(element).toBeInTheDocument();
		expect(element).toHaveClass(className);
	});

	// it('can disable styles', () => {
	// 	const rendered = render(<Filter {...args} disableStyles />);

	// 	const filterElement = rendered.container.querySelector('.ss__filter');

	// 	expect(filterElement?.classList).toHaveLength(1);
	// });
	// describe('Filter theming works', () => {
	// 	const args = {
	// 		facetLabel: 'facet',
	// 		valueLabel: 'value',
	// 	};

	// 	it('is themeable with ThemeProvider', () => {
	// 		const globalTheme = {
	// 			components: {
	// 				filter: {
	// 					separator: 'seperator',
	// 				},
	// 			},
	// 		};
	// 		const rendered = render(
	// 			<ThemeProvider theme={globalTheme}>
	// 				<Filter {...args} />
	// 			</ThemeProvider>
	// 		);
	// 		const seperator = rendered.container.querySelector('.ss__filter__label__separator');
	// 		expect(seperator).toBeInTheDocument();
	// 		expect(seperator).toHaveTextContent(globalTheme.components.filter.separator);
	// 	});

	// 	it('is themeable with theme prop', () => {
	// 		const propTheme = {
	// 			components: {
	// 				filter: {
	// 					separator: 'seperator',
	// 				},
	// 			},
	// 		};
	// 		const rendered = render(<Filter {...args} theme={propTheme} />);
	// 		const seperator = rendered.container.querySelector('.ss__filter__label__separator');
	// 		expect(seperator).toBeInTheDocument();
	// 		expect(seperator).toHaveTextContent(propTheme.components.filter.separator);
	// 	});

	// 	it('is theme prop overrides ThemeProvider', () => {
	// 		const globalTheme = {
	// 			components: {
	// 				filter: {
	// 					separator: 'seperator',
	// 				},
	// 			},
	// 		};
	// 		const propTheme = {
	// 			components: {
	// 				filter: {
	// 					separator: '---',
	// 				},
	// 			},
	// 		};
	// 		const rendered = render(
	// 			<ThemeProvider theme={globalTheme}>
	// 				<Filter {...args} theme={propTheme} />
	// 			</ThemeProvider>
	// 		);

	// 		const seperator = rendered.container.querySelector('.ss__filter__label__separator');
	// 		expect(seperator).toBeInTheDocument();
	// 		expect(seperator).toHaveTextContent(propTheme.components.filter.separator);
	// 	});
	// });
});

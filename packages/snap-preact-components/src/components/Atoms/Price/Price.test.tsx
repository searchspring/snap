import { h } from 'preact';
import { render } from '@testing-library/preact';

import { Price } from './Price';
import { ThemeProvider } from '../../../providers';
import themes from '../../../themes';

describe('Price Component', () => {
	Object.keys(themes || {}).forEach((themeName) => {
		it(`uses ${themeName} theme`, () => {
			const theme = themes[themeName as keyof typeof themes];
			const rendered = render(<Price theme={theme} value={1099.99} lineThrough={true} />);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	it('renders', () => {
		const rendered = render(<Price value={1099.99} />);
		const priceElement = rendered.container.querySelector('.ss__price');
		expect(priceElement).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has a line-through', () => {
		const args = {
			value: 1099.99,
			lineThrough: true,
		};
		const rendered = render(<Price {...args} />);
		const priceElement = rendered.container.querySelector('.ss__price')!;
		const styles = getComputedStyle(priceElement);
		expect(styles.textDecoration).toBe('line-through');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has default custom options', () => {
		const args = {
			value: 1099.99,
		};
		const rendered = render(<Price {...args} />);
		const priceElement = rendered.container.querySelector('.ss__price');
		const priceText = priceElement?.textContent;
		expect(priceText).toBe('$1,099.99');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has custom options', () => {
		const args = {
			value: 1099.99,
			symbol: ' £',
			decimalPlaces: 2,
			thousandsSeparator: '.',
			decimalSeparator: '.',
			symbolAfter: true,
		};
		const rendered = render(<Price {...args} />);
		const priceElement = rendered.container.querySelector('.ss__price');
		const priceText = priceElement?.textContent;
		expect(priceText).toBe('1.099.99 £');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with additional style using prop', () => {
		const style = {
			padding: '20px',
		};

		const rendered = render(<Price value={100} style={style} />);
		const priceElement = rendered.container.querySelector('.ss__price')!;
		const styles = getComputedStyle(priceElement);

		expect(styles.padding).toBe(style.padding);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can disable styling', () => {
		const args = {
			value: 1099.99,
			disableStyles: true,
		};
		const rendered = render(<Price {...args} />);
		const priceElement = rendered.container.querySelector('.ss__price');
		expect(priceElement?.className).not.toMatch(/formatted-/);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can custom className', () => {
		const args = {
			value: 1099.99,
			className: 'custom-class',
		};
		const rendered = render(<Price {...args} />);
		const priceElement = rendered.container.querySelector('.ss__price');
		expect(priceElement?.classList).toContain(args.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				price: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Price value={1099.99} />
			</ThemeProvider>
		);

		const priceElement = rendered.container.querySelector('.ss__price');
		expect(priceElement).toHaveClass(globalTheme.components.price.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				price: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(<Price value={1099.99} theme={propTheme} />);

		const priceElement = rendered.container.querySelector('.ss__price');
		expect(priceElement).toHaveClass(propTheme.components.price.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				price: {
					className: 'global-class',
				},
			},
		};

		const propTheme = {
			components: {
				price: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Price value={1099.99} theme={propTheme} />
			</ThemeProvider>
		);

		const priceElement = rendered.container.querySelector('.ss__price');
		expect(priceElement).toHaveClass(propTheme.components.price.className);
		expect(priceElement).not.toHaveClass(globalTheme.components.price.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});

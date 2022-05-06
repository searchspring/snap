import { h } from 'preact';
import { render } from '@testing-library/preact';

import { Price } from './Price';
import { ThemeProvider } from '../../../providers';

describe('Price Component', () => {
	it('renders', () => {
		const rendered = render(<Price value={1099.99} />);
		const priceElement = rendered.container.querySelector('.ss__price');
		expect(priceElement).toBeInTheDocument();
	});

	it('has a line-through', () => {
		const args = {
			value: 1099.99,
			lineThrough: true,
		};
		const rendered = render(<Price {...args} />);
		const priceElement = rendered.container.querySelector('.ss__price');
		const styles = getComputedStyle(priceElement!);
		expect(styles?.textDecoration).toBe('line-through');
	});

	it('has default custom options', () => {
		const args = {
			value: 1099.99,
		};
		const rendered = render(<Price {...args} />);
		const priceElement = rendered.container.querySelector('.ss__price');
		const priceText = priceElement?.textContent;
		expect(priceText).toBe('$1,099.99');
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
	});

	it('renders with additional style using prop', () => {
		const style = {
			padding: '20px',
		};

		const rendered = render(<Price value={100} style={style} />);
		const priceElement = rendered.container.querySelector('.ss__price');
		const styles = getComputedStyle(priceElement!);

		expect(styles?.padding).toBe(style.padding);
	});

	it('can disable styling', () => {
		const args = {
			value: 1099.99,
			disableStyles: true,
		};
		const rendered = render(<Price {...args} />);
		const priceElement = rendered.container.querySelector('.ss__price');
		expect(priceElement?.className).not.toMatch(/formatted-/);
	});

	it('can custom className', () => {
		const args = {
			value: 1099.99,
			className: 'custom-class',
		};
		const rendered = render(<Price {...args} />);
		const priceElement = rendered.container.querySelector('.ss__price');
		expect(priceElement?.classList).toContain(args.className);
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
	});
});

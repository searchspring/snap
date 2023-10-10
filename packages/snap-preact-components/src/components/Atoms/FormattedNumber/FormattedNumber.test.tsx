import { h } from 'preact';
import { render } from '@testing-library/preact';

import { FormattedNumber } from './FormattedNumber';
import { ThemeProvider } from '../../../providers';
import themes from '../../../themes';

describe('FormattedNumber Component', () => {
	Object.keys(themes || {}).forEach((themeName) => {
		it(`uses ${themeName} theme`, () => {
			const theme = themes[themeName as keyof typeof themes];
			const rendered = render(<FormattedNumber theme={theme} value={1099.99} />);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});
	it('renders', () => {
		const rendered = render(<FormattedNumber value={1099.99} />);
		const formattednumberElement = rendered.container.querySelector('.ss__formatted-number');
		expect(formattednumberElement).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has default formatting', () => {
		const args = {
			value: 1099.99999,
			symbol: 'mm',
		};
		const rendered = render(<FormattedNumber {...args} />);
		const formattednumberElement = rendered.container.querySelector('.ss__formatted-number');
		const formattednumber = formattednumberElement?.textContent;
		expect(formattednumber).toBe('1099.999mm');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has support for custom options', () => {
		const args = {
			value: 1099.999999,
			symbol: ' £',
			decimalPlaces: 2,
			thousandsSeparator: '.',
			decimalSeparator: ',',
			symbolAfter: true,
		};
		const rendered = render(<FormattedNumber {...args} />);
		const formattednumberElement = rendered.container.querySelector('.ss__formatted-number');
		const formattednumber = formattednumberElement?.textContent;
		expect(formattednumber).toBe('1.099,99 £');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('pads digits when it needs to', () => {
		const args = {
			value: 1099,
		};
		const rendered = render(<FormattedNumber {...args} />);
		const formattednumberElement = rendered.container.querySelector('.ss__formatted-number');
		const formattednumber = formattednumberElement?.textContent;
		expect(formattednumber).toBe('1099.000');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('does not pads digits when prop specified', () => {
		const args = {
			value: 1099,
			padDecimalPlaces: false,
		};
		const rendered = render(<FormattedNumber {...args} />);
		const formattednumberElement = rendered.container.querySelector('.ss__formatted-number');
		const formattednumber = formattednumberElement?.textContent;
		expect(formattednumber).toBe('1099');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with additional style using prop', () => {
		const style = {
			padding: '20px',
		};

		const rendered = render(<FormattedNumber value={100} style={style} />);
		const formattednumberElement = rendered.container.querySelector('.ss__formatted-number')!;
		const styles = getComputedStyle(formattednumberElement);

		expect(styles.padding).toBe(style.padding);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can disable styling', () => {
		const args = {
			value: 1099.99,
			disableStyles: true,
			style: {
				padding: '20px',
			},
		};
		const rendered = render(<FormattedNumber {...args} />);
		const formattednumberElement = rendered.container.querySelector('.ss__formatted-number')!;
		const styles = getComputedStyle(formattednumberElement);
		expect(styles.background).not.toBe(args.style.padding);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('uses custom className', () => {
		const args = {
			value: 1099.99,
			className: 'custom-class',
		};
		const rendered = render(<FormattedNumber {...args} />);
		const formattednumberElement = rendered.container.querySelector('.ss__formatted-number');
		expect(formattednumberElement?.classList).toContain(args.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				formattedNumber: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FormattedNumber value={33.333} />
			</ThemeProvider>
		);

		const formattednumberElement = rendered.container.querySelector('.ss__formatted-number');
		expect(formattednumberElement).toHaveClass(globalTheme.components.formattedNumber.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				formattedNumber: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(<FormattedNumber theme={propTheme} value={33.333} />);

		const formattednumberElement = rendered.container.querySelector('.ss__formatted-number');
		expect(formattednumberElement).toHaveClass(propTheme.components.formattedNumber.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				formattedNumber: {
					className: 'global-class',
				},
			},
		};

		const propTheme = {
			components: {
				formattedNumber: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<FormattedNumber value={33.333} theme={propTheme} />
			</ThemeProvider>
		);

		const formattednumberElement = rendered.container.querySelector('.ss__formatted-number');
		expect(formattednumberElement).toHaveClass(propTheme.components.formattedNumber.className);
		expect(formattednumberElement).not.toHaveClass(globalTheme.components.formattedNumber.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});

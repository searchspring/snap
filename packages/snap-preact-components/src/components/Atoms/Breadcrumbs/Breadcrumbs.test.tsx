import { h } from 'preact';

import { render } from '@testing-library/preact';

import { Breadcrumbs } from './Breadcrumbs';
import { ThemeProvider } from '../../../providers';

describe('Breadcrumbs Component', () => {
	const args = {
		data: [
			{
				url: '/',
				label: 'Home',
			},
			{
				url: '/',
				label: 'Collections',
			},
			{
				url: '/',
				label: 'Appliances',
			},
			{
				label: 'Fridge',
			},
		],
	};

	it('renders', () => {
		const rendered = render(<Breadcrumbs {...args} />);
		const breadcrumbElement = rendered.container.querySelector('.ss__breadcrumbs');
		expect(breadcrumbElement).toBeInTheDocument();
		expect(breadcrumbElement?.classList.length).toBe(2);
	});

	it('uses links when url is present in data', () => {
		const label = args.data[0].label;
		const url = args.data[0].url;

		const rendered = render(<Breadcrumbs {...args} />);

		const breadcrumbElement = rendered.container.querySelector('.ss__breadcrumbs li:first-child');
		expect(breadcrumbElement).toBeInTheDocument();

		const anchorElement = breadcrumbElement?.querySelector('a');
		expect(anchorElement).toBeInTheDocument();
		expect(anchorElement).toHaveAttribute('href', url);
		expect(anchorElement).toHaveTextContent(label);
	});

	it('does not use links when url is not present in data', () => {
		const rendered = render(<Breadcrumbs {...args} />);

		const breadcrumbElement = rendered.container.querySelector('.ss__breadcrumbs li:last-child');
		expect(breadcrumbElement).toBeInTheDocument();

		const anchorElement = breadcrumbElement?.querySelector('a');
		expect(anchorElement).not.toBeInTheDocument();

		expect(breadcrumbElement).toHaveTextContent(args.data[args.data.length - 1].label);
	});

	it('has all crumbs and separators', () => {
		const rendered = render(<Breadcrumbs {...args} />);
		const breadcrumbElements = rendered.container.querySelectorAll('.ss__breadcrumbs li');
		expect(breadcrumbElements.length).toEqual(args.data.length * 2 - 1);
	});

	it('has custom string separator', () => {
		const stringSeparator = '>>';

		const rendered = render(<Breadcrumbs {...args} separator={stringSeparator} />);
		const breadcrumbSeparatorElements = rendered.container.querySelectorAll('.ss__breadcrumbs li:nth-child(even)');
		expect(breadcrumbSeparatorElements.length).toEqual(args.data.length - 1);
		expect(breadcrumbSeparatorElements[0].textContent).toEqual('>>');
	});

	it('has custom component separator', () => {
		const componentSeparator = <span>|</span>;

		const rendered = render(<Breadcrumbs {...args} separator={componentSeparator} />);
		const breadcrumbSeparatorElements = rendered.container.querySelectorAll('.ss__breadcrumbs li:nth-child(even)');
		expect(breadcrumbSeparatorElements.length).toEqual(args.data.length - 1);
		expect(breadcrumbSeparatorElements[0].textContent).toEqual('|');
	});

	it('renders with additional style using prop', () => {
		const style = {
			padding: '20px',
		};

		const rendered = render(<Breadcrumbs {...args} style={style} />);
		const breadcrumbElement = rendered.container.querySelector('.ss__breadcrumbs');
		let styles;
		if (breadcrumbElement) styles = getComputedStyle(breadcrumbElement);

		expect(styles?.padding).toBe(style.padding);
	});

	it('respects disableStyles prop when true', () => {
		const rendered = render(<Breadcrumbs {...args} disableStyles />);
		const breadcrumbElement = rendered.container.querySelector('.ss__breadcrumbs');

		expect(breadcrumbElement?.classList.length).toBe(1);
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				breadcrumbs: {
					className: 'global-theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Breadcrumbs {...args} />
			</ThemeProvider>
		);

		const breadcrumbElement = rendered.container.querySelector('.ss__breadcrumbs');
		expect(breadcrumbElement).toHaveClass(globalTheme.components.breadcrumbs.className);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				breadcrumbs: {
					className: 'props-theme-class',
				},
			},
		};

		const rendered = render(<Breadcrumbs {...args} theme={propTheme} />);

		const breadcrumbElement = rendered.container.querySelector('.ss__breadcrumbs');
		expect(breadcrumbElement).toHaveClass(propTheme.components.breadcrumbs.className);
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				breadcrumbs: {
					className: 'global-class',
				},
			},
		};

		const propTheme = {
			components: {
				breadcrumbs: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Breadcrumbs {...args} theme={propTheme} />
			</ThemeProvider>
		);

		const breadcrumbElement = rendered.container.querySelector('.ss__breadcrumbs');
		expect(breadcrumbElement).toHaveClass(propTheme.components.breadcrumbs.className);
		expect(breadcrumbElement).not.toHaveClass(globalTheme.components.breadcrumbs.className);
	});
});

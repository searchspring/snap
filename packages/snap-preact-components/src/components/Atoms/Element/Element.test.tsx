import { h } from 'preact';

import { render } from '@testing-library/preact';

import { Element } from './Element';
import { ThemeProvider } from '../../../providers';
import themes from '../../../themes';

describe('Element Component', () => {
	const text = 'some text';

	Object.keys(themes || {}).forEach((themeName) => {
		it(`uses ${themeName} theme`, () => {
			const theme = themes[themeName as keyof typeof themes];
			const rendered = render(<Element theme={theme} type={'div'} content={text} />);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});
	it('renders as div', () => {
		const rendered = render(<Element type={'div'} content={text} />);

		const element = rendered.container.querySelector('div.ss__element');
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent(text);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders as span', () => {
		const rendered = render(<Element type="span" content={text} />);

		const element = rendered.container.querySelector('span.ss__element');
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent(text);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders as label', () => {
		const rendered = render(<Element type="label" content={text} />);

		const element = rendered.container.querySelector('label.ss__element');
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent(text);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders as p', () => {
		const rendered = render(<Element type="p" content={text} />);

		const element = rendered.container.querySelector('p.ss__element');
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent(text);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('doesnt render without type prop', () => {
		// @ts-ignore
		const rendered = render(<Element />);

		const element = rendered.container.querySelector('.ss__element');
		expect(element).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with attributes', () => {
		const attributes = {
			attribute1: 'one',
			attribute2: 'two',
			attribute3: 3,
		};
		const rendered = render(<Element type="div" content={text} attributes={attributes} />);

		const element = rendered.container.querySelector('div.ss__element');
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent(text);

		expect(element).toHaveAttribute('attribute1', attributes.attribute1);
		expect(element).toHaveAttribute('attribute2', attributes.attribute2);
		expect(element).toHaveAttribute('attribute3', attributes.attribute3.toString());
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('ignores onClick attribute', () => {
		const attributes = {
			onClick: () => {},
			attribute2: 'two',
			attribute3: 3,
		};
		// @ts-ignore
		const rendered = render(<Element type="div" content={text} attributes={attributes} />);

		const element = rendered.container.querySelector('div.ss__element');
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent(text);

		expect(element).not.toHaveAttribute('onClick');
		expect(element).toHaveAttribute('attribute2', attributes.attribute2);
		expect(element).toHaveAttribute('attribute3', attributes.attribute3.toString());
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with className prop', () => {
		const className = 'classy';
		const rendered = render(<Element type={'div'} className={className} />);

		const element = rendered.container.querySelector(`.ss__element.${className}`);
		expect(element).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('disables styles', () => {
		const rendered = render(<Element type={'div'} disableStyles />);

		const element = rendered.container.querySelector('.ss__element');
		expect(element?.classList).toHaveLength(1);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				element: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Element type="div" />
			</ThemeProvider>
		);

		const dropdownElement = rendered.container.querySelector('.ss__element');
		expect(dropdownElement).toHaveClass(globalTheme.components.element.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				element: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(<Element type="div" theme={propTheme} />);

		const dropdownElement = rendered.container.querySelector('.ss__element');
		expect(dropdownElement).toHaveClass(propTheme.components.element.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable and theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				element: {
					className: 'global-class',
				},
			},
		};

		const propTheme = {
			components: {
				element: {
					className: 'theme-class',
				},
			},
		};

		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Element type="div" theme={propTheme} />
			</ThemeProvider>
		);

		const dropdownElement = rendered.container.querySelector('.ss__element');
		expect(dropdownElement).toHaveClass(propTheme.components.element.className);
		expect(dropdownElement).not.toHaveClass(globalTheme.components.element.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});

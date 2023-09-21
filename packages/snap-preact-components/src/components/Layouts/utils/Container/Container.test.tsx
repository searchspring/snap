import { h } from 'preact';

import { render } from '@testing-library/preact';

import { Container } from './Container';
import { Theme, ThemeProvider } from '../../../../providers';

describe('Container Component', () => {
	it('renders', () => {
		const rendered = render(<Container />);
		const element = rendered.container.querySelector('div.ss__container');
		expect(element).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders as item', () => {
		const rendered = render(<Container item={true} />);
		const element = rendered.container.querySelector('div.ss__container-item');
		expect(element).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with children', () => {
		const text = 'findMe';
		const children = (
			<div className="parent">
				<span className="child">{text}</span>
			</div>
		);
		const rendered = render(<Container>{children}</Container>);
		const element = rendered.container.querySelector('.ss__container');
		const parent = rendered.container.querySelector('.ss__container .parent');
		const child = rendered.container.querySelector('.ss__container .parent .child');

		expect(element).toBeInTheDocument();
		expect(parent).toBeInTheDocument();
		expect(child).toBeInTheDocument();
		expect(child).toHaveTextContent(text);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders as link', () => {
		const link = 'www.href.com';
		const rendered = render(<Container href={link} />);
		const element = rendered.container.querySelector('a.ss__container');
		expect(element).toBeInTheDocument();
		expect(element).toHaveAttribute('href', link);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders as link item', () => {
		const link = 'www.href.com';
		const rendered = render(<Container href={link} item={true} />);
		const element = rendered.container.querySelector('a.ss__container-item');
		expect(element).toBeInTheDocument();
		expect(element).toHaveAttribute('href', link);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders as link with children', () => {
		const text = 'findMe';
		const link = 'www.href.com';
		const children = (
			<div className="parent">
				<span className="child">{text}</span>
			</div>
		);
		const rendered = render(<Container href={link}>{children}</Container>);

		const element = rendered.container.querySelector('a.ss__container');
		const parent = rendered.container.querySelector('a.ss__container .parent');
		const child = rendered.container.querySelector('a.ss__container .parent .child');

		expect(element).toBeInTheDocument();
		expect(parent).toBeInTheDocument();
		expect(child).toBeInTheDocument();
		expect(element).toHaveAttribute('href', link);
		expect(child).toHaveTextContent(text);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<Container className={className} />);
		const elem = rendered.container.querySelector('.ss__container');

		expect(elem).toHaveClass(className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('disables styles', () => {
		const rendered = render(<Container disableStyles />);
		const elem = rendered.container.querySelector('.ss__container');

		expect(elem?.classList).toHaveLength(1);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	describe('styling props', () => {
		it('can set a width', () => {
			const prop = '15px';
			const rendered = render(<Container width={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`width: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can set a height', () => {
			const prop = '15px';
			const rendered = render(<Container height={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`height: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can set a alignItems', () => {
			const prop = 'center';
			const rendered = render(<Container alignItems={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`alignItems: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can set a alignContent', () => {
			const prop = 'start';
			const rendered = render(<Container alignContent={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`alignContent: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can set a flexWrap', () => {
			const prop = 'wrap';
			const rendered = render(<Container flexWrap={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`flexWrap: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can set a flexDirection', () => {
			const prop = 'row';
			const rendered = render(<Container flexDirection={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`flexDirection: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can set a flexGrow', () => {
			const prop = 2;
			const rendered = render(<Container flexGrow={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`flexGrow: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can set a flexShrink', () => {
			const prop = 2;
			const rendered = render(<Container flexShrink={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`flexShrink: ${prop}`);
		});

		it('can set a alignSelf', () => {
			const prop = 'center';
			const rendered = render(<Container alignSelf={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`alignSelf: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can set a flexFlow', () => {
			const prop = 'row';
			const rendered = render(<Container flexFlow={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`flexFlow: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can set a justifyContent', () => {
			const prop = 'center';
			const rendered = render(<Container justifyContent={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`justifyContent: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can set a flex', () => {
			const prop = '1';
			const rendered = render(<Container flex={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`flex: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can set a flexBasis', () => {
			const prop = '1';
			const rendered = render(<Container flexBasis={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`flexBasis: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can set a textAlign', () => {
			const prop = 'center';
			const rendered = render(<Container textAlign={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`textAlign: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can set a gap', () => {
			const prop = '20px';
			const rendered = render(<Container gap={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`gap: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can set a rowGap', () => {
			const prop = '20px';
			const rendered = render(<Container rowGap={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`rowGap: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can set a columnGap', () => {
			const prop = '20px';
			const rendered = render(<Container columnGap={prop} />);
			const element = rendered.container.querySelector('.ss__container');
			expect(element).toBeInTheDocument();
			expect(element).toHaveStyle(`columnGap: ${prop}`);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	describe('Container theming works', () => {
		it('is themeable with ThemeProvider', () => {
			const globalTheme = {
				components: {
					container: {
						disableStyles: true,
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Container height="300px" width="300px" />
				</ThemeProvider>
			);
			const elem = rendered.container.querySelector('.ss__container');
			expect(elem).toBeInTheDocument();
			expect(elem?.classList.length).toBe(1);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('is themeable with theme prop', () => {
			const propTheme = {
				components: {
					container: {
						disableStyles: true,
					},
				},
			} as Theme;
			const rendered = render(<Container height="300px" width="300px" theme={propTheme} />);
			const elem = rendered.container.querySelector('.ss__container');
			expect(elem).toBeInTheDocument();
			expect(elem?.classList.length).toBe(1);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('is theme prop overrides ThemeProvider', () => {
			const globalTheme = {
				components: {
					container: {
						disableStyles: false,
					},
				},
			};
			const propTheme = {
				components: {
					container: {
						disableStyles: true,
					},
				},
			} as Theme;
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Container height="300px" width="300px" theme={propTheme} />
				</ThemeProvider>
			);

			const elem = rendered.container.querySelector('.ss__container');
			expect(elem).toBeInTheDocument();
			expect(elem?.classList.length).toBe(1);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});
});

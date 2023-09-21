import { h } from 'preact';

import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { Slideout, SlideDirectionType } from './Slideout';
import { ThemeProvider } from '../../../providers';

describe('Slideout Component', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query) => ({
				matches: true,
				media: query,
				onchange: null,
				addListener: jest.fn(), // Deprecated
				removeListener: jest.fn(), // Deprecated
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});
	});

	const theme = {
		components: {
			slideout: {
				width: '550px',
			},
		},
	};

	it('renders and is visible', () => {
		const args = {
			active: true,
		};
		const rendered = render(<Slideout {...args} />);
		const slideoutElement = rendered.container.querySelector('.ss__slideout')!;
		const styles = getComputedStyle(slideoutElement);
		expect(slideoutElement).toBeInTheDocument();
		expect(styles.left).toBe('0px');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is not visible', () => {
		const args = {
			active: false,
		};
		const rendered = render(<Slideout {...args} />);
		const slideoutElement = rendered.container.querySelector('.ss__slideout')!;
		const styles = getComputedStyle(slideoutElement);
		expect(styles.left).toBe('-300px');
		expect(styles.left).not.toBe('0px');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has custom width', () => {
		const args = {
			active: false,
			width: '400px',
		};
		const rendered = render(<Slideout {...args} />);
		const slideoutElement = rendered.container.querySelector('.ss__slideout')!;
		const styles = getComputedStyle(slideoutElement);
		expect(styles.maxWidth).toBe(args.width);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has custom displayAtWidth', () => {
		const args = {
			active: false,
			width: '400px',
			displayAt: '(min-width: 600px)',
		};
		const rendered = render(<Slideout {...args} />);
		const slideoutElement = rendered.container.querySelector('.ss__slideout');
		expect(slideoutElement).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('does not render if matchMedia returns false', () => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query) => ({
				matches: false, // return false
				media: query,
				onchange: null,
				addListener: jest.fn(), // Deprecated
				removeListener: jest.fn(), // Deprecated
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});
		const args = {
			active: false,
		};
		const rendered = render(<Slideout {...args} />);
		const slideoutElement = rendered.container.querySelector('.ss__slideout');
		expect(slideoutElement).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('displays overlay', () => {
		const args = {
			active: true,
		};
		const rendered = render(<Slideout {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__overlay.ss__overlay--active');
		expect(overlayElement).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('hides overlay when inactive', () => {
		const args = {
			active: false,
		};
		const rendered = render(<Slideout {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__overlay.ss__overlay--active');
		expect(overlayElement).not.toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has custom overlay color', () => {
		const args = {
			active: true,
			overlayColor: 'rgba(0, 0, 0, 0.1)',
		};
		const rendered = render(<Slideout {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__overlay.ss__overlay--active')!;
		const styles = getComputedStyle(overlayElement);
		expect(styles.background).toBe(args.overlayColor);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can set custom slideDirection', () => {
		const args = {
			active: true,
			slideDirection: 'right' as SlideDirectionType,
		};
		const rendered = render(<Slideout {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__slideout.ss__slideout--active')!;
		const styles = getComputedStyle(overlayElement);
		expect(styles.right).toBe('0px');
		expect(styles.left).toBe('');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can set custom transitionSpeed', () => {
		const args = {
			active: true,
			transitionSpeed: '0.55s',
		};
		const rendered = render(<Slideout {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__slideout.ss__slideout--active')!;
		const styles = getComputedStyle(overlayElement);
		expect(styles.transition).toBe(`left ${args.transitionSpeed}`);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders a wrapper element with classname', () => {
		const args = {
			active: true,
			buttonContent: 'click me',
		};
		const rendered = render(<Slideout {...args} />);

		const buttonElement = rendered.container.querySelector('.ss__slideout__button');
		expect(buttonElement).toBeInTheDocument();
		expect(buttonElement).toHaveTextContent(args.buttonContent);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('does not render a wrapper element when using "noButtonWrapper" prop', () => {
		const args = {
			noButtonWrapper: true,
			className: 'clickit',
			buttonContent: <div>click me</div>,
		};
		const rendered = render(<Slideout {...args} />);

		const buttonWrapperElement = rendered.container.querySelector('.ss__slideout__button');
		const buttonElement = rendered.container.querySelector(`.${args.className}`);
		expect(buttonWrapperElement).not.toBeInTheDocument();
		expect(buttonElement).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('toggles the "ss__slideout--active" class when the button is clicked', async () => {
		const args = {
			buttonContent: 'click me',
		};
		const rendered = render(<Slideout {...args} />);

		const buttonElement = rendered.container.querySelector('.ss__slideout__button');
		const containerElement = rendered.container.querySelector('.ss__slideout');

		expect(containerElement).not.toHaveClass('ss__slideout--active');
		expect(rendered.asFragment()).toMatchSnapshot();

		// click the button
		if (buttonElement) await userEvent.click(buttonElement);
		expect(containerElement).toHaveClass('ss__slideout--active');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('toggles the "ss__slideout--active" class when using clonedElement props', async () => {
		const ButtonComponent = (props: any) => {
			return (
				<div className="custom-button" onClick={() => props.toggleActive()}>
					{props.active ? 'active' : 'inactive'}
				</div>
			);
		};

		const args = {
			noButtonWrapper: true,
			buttonContent: <ButtonComponent />,
		};

		const rendered = render(<Slideout {...args} />);
		const buttonElement = rendered.container.querySelector('.custom-button');
		const containerElement = rendered.container.querySelector('.ss__slideout');

		expect(containerElement).not.toHaveClass('ss__slideout--active');
		expect(buttonElement).toHaveTextContent('inactive');
		expect(rendered.asFragment()).toMatchSnapshot();

		// click the button
		if (buttonElement) await userEvent.click(buttonElement);
		expect(containerElement).toHaveClass('ss__slideout--active');
		expect(buttonElement).toHaveTextContent('active');
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can disable styles', () => {
		const args = {
			active: true,
			disableStyles: true,
		};
		const rendered = render(<Slideout {...args} />);

		const resultElement = rendered.container.querySelector('.ss__slideout');

		expect(resultElement?.classList).toHaveLength(2);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can add additional styles', () => {
		const args = {
			disableStyles: true,
			style: {
				backgroundColor: 'green',
			},
		};

		const rendered = render(<Slideout {...args} />);
		const slideoutElement = rendered.container.querySelector('.ss__slideout');
		const styles = getComputedStyle(slideoutElement!);

		expect(styles.backgroundColor).toBe(args.style.backgroundColor);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with ThemeProvider', () => {
		const args = {
			active: true,
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<Slideout {...args} />
			</ThemeProvider>
		);
		const slideoutElement = rendered.container.querySelector('.ss__slideout')!;
		const styles = getComputedStyle(slideoutElement);
		expect(styles.maxWidth).toBe(theme.components.slideout.width);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme prop', () => {
		const args = {
			active: true,
		};
		const rendered = render(<Slideout {...args} theme={theme} />);
		const slideoutElement = rendered.container.querySelector('.ss__slideout')!;
		const styles = getComputedStyle(slideoutElement);
		expect(styles.maxWidth).toBe(theme.components.slideout.width);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme  prop overrides ThemeProvider', () => {
		const args = {
			active: true,
		};
		const themeOverride = {
			components: {
				slideout: {
					width: '600px',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<Slideout {...args} theme={themeOverride} />
			</ThemeProvider>
		);
		const slideoutElement = rendered.container.querySelector('.ss__slideout')!;
		const styles = getComputedStyle(slideoutElement);
		expect(styles.maxWidth).toBe(themeOverride.components.slideout.width);
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});

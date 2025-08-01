import { h } from 'preact';

import { render, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { Slideout, SlideDirectionType } from './Slideout';
import { ThemeProvider } from '../../../providers';
import { wait } from '@testing-library/user-event/dist/utils';

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
			buttonContent: 'click me',
		};
		const rendered = render(<Slideout {...args} />);
		const slideoutElement = rendered.container.querySelector('.ss__slideout')!;
		const styles = getComputedStyle(slideoutElement);
		expect(slideoutElement).toBeInTheDocument();
		expect(styles.left).toBe('0px');
	});

	it('is not visible', () => {
		const args = {
			active: false,
			buttonContent: 'click me',
		};
		const rendered = render(<Slideout {...args} />);
		const slideoutElement = rendered.container.querySelector('.ss__slideout')!;
		const styles = getComputedStyle(slideoutElement);
		expect(styles.left).toBe('-300px');
		expect(styles.left).not.toBe('0px');
	});

	it('has custom width', () => {
		const args = {
			active: false,
			width: '400px',
			buttonContent: 'click me',
		};
		const rendered = render(<Slideout {...args} />);
		const slideoutElement = rendered.container.querySelector('.ss__slideout')!;
		const styles = getComputedStyle(slideoutElement);
		expect(styles.maxWidth).toBe(args.width);
	});

	it('has custom displayAtWidth', () => {
		const args = {
			active: false,
			width: '400px',
			displayAt: '(min-width: 600px)',
			buttonContent: 'click me',
		};
		const rendered = render(<Slideout {...args} />);
		const slideoutElement = rendered.container.querySelector('.ss__slideout');
		expect(slideoutElement).toBeInTheDocument();
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
			buttonContent: 'click me',
		};
		const rendered = render(<Slideout {...args} />);
		const slideoutElement = rendered.container.querySelector('.ss__slideout');
		expect(slideoutElement).not.toBeInTheDocument();
	});

	it('displays overlay', () => {
		const args = {
			active: true,
			buttonContent: 'click me',
		};
		const rendered = render(<Slideout {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__overlay.ss__overlay--active');
		expect(overlayElement).toBeInTheDocument();
	});

	it('hides overlay when inactive', () => {
		const args = {
			active: false,
			buttonContent: 'click me',
		};
		const rendered = render(<Slideout {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__overlay.ss__overlay--active');
		expect(overlayElement).not.toBeInTheDocument();
	});

	it('has custom overlay color', () => {
		const args = {
			active: true,
			overlayColor: 'rgba(0, 0, 0, 0.1)',
			buttonContent: 'click me',
		};
		const rendered = render(<Slideout {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__overlay.ss__overlay--active')!;
		const styles = getComputedStyle(overlayElement);
		expect(styles.background).toBe(args.overlayColor);
	});

	it('can set custom slideDirection', () => {
		const args = {
			active: true,
			slideDirection: 'right' as SlideDirectionType,
			buttonContent: 'click me',
		};
		const rendered = render(<Slideout {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__slideout.ss__slideout--active')!;
		const styles = getComputedStyle(overlayElement);
		expect(styles.right).toBe('0px');
		expect(styles.left).toBe('');
	});

	it('can set custom transitionSpeed', () => {
		const args = {
			active: true,
			transitionSpeed: '0.55s',
			buttonContent: 'click me',
		};
		const rendered = render(<Slideout {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__slideout.ss__slideout--active')!;
		const styles = getComputedStyle(overlayElement);
		expect(styles.transition).toBe(`left ${args.transitionSpeed}`);
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
	});

	it('toggles the "ss__slideout--active" class when the button is clicked', async () => {
		const args = {
			buttonContent: 'click me',
		};
		const rendered = render(<Slideout {...args} />);

		const buttonElement = rendered.container.querySelector('.ss__slideout__button');
		const containerElement = rendered.container.querySelector('.ss__slideout');

		expect(containerElement).not.toHaveClass('ss__slideout--active');

		// click the button
		if (buttonElement) await userEvent.click(buttonElement);
		expect(containerElement).toHaveClass('ss__slideout--active');
	});

	it('toggles the "ss__slideout--active" class when the button is clicked', async () => {
		const args = {
			buttonContent: 'click me',
		};
		const rendered = render(
			<Slideout {...args}>
				<div id="findme">findme</div>
			</Slideout>
		);

		const buttonElement = rendered.container.querySelector('.ss__slideout__button');
		const containerElement = rendered.container.querySelector('.ss__slideout');
		const findMeDiv = rendered.container.querySelector('#findme');

		expect(containerElement).not.toHaveClass('ss__slideout--active');
		expect(findMeDiv).not.toBeInTheDocument();

		// click the button
		userEvent.click(buttonElement!);

		await waitFor(() => {
			const containerElement = rendered.container.querySelector('.ss__slideout');
			const findMeDiv = rendered.container.querySelector('#findme');
			expect(containerElement).toHaveClass('ss__slideout--active');
			expect(findMeDiv).toBeInTheDocument();
		});
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

		// click the button
		if (buttonElement) await userEvent.click(buttonElement);
		expect(containerElement).toHaveClass('ss__slideout--active');
		expect(buttonElement).toHaveTextContent('active');
	});

	it('toggles the "ss__slideout--active" class when the buttonSelector elem is clicked', async () => {
		const args = {
			buttonSelector: '#clickMe',
		};
		const rendered = render(
			<>
				<div id="clickMe">click me</div>
				<Slideout {...args}>
					<div id="findme">findme</div>
				</Slideout>
			</>
		);

		const buttonElement = rendered.container.querySelector('#clickMe');
		const containerElement = rendered.container.querySelector('.ss__slideout');
		const findMeDiv = rendered.container.querySelector('#findme');

		expect(containerElement).not.toHaveClass('ss__slideout--active');
		expect(findMeDiv).not.toBeInTheDocument();

		// click the button
		userEvent.click(buttonElement!);
		await waitFor(() => {
			const containerElement = rendered.container.querySelector('.ss__slideout');
			const findMeDiv = rendered.container.querySelector('#findme');
			expect(containerElement).toHaveClass('ss__slideout--active');
			expect(findMeDiv).toBeInTheDocument();
		});
	});

	it('can disable styles', () => {
		const args = {
			active: true,
			disableStyles: true,
			buttonContent: 'click me',
		};
		const rendered = render(<Slideout {...args} />);

		const resultElement = rendered.container.querySelector('.ss__slideout');

		expect(resultElement?.classList).toHaveLength(2);
	});

	it('can add additional styles', () => {
		const args = {
			buttonContent: 'click me',
			disableStyles: true,
			style: {
				backgroundColor: 'green',
			},
		};

		const rendered = render(<Slideout {...args} />);
		const slideoutElement = rendered.container.querySelector('.ss__slideout');
		const styles = getComputedStyle(slideoutElement!);

		expect(styles.backgroundColor).toBe(args.style.backgroundColor);
	});

	it('is themeable with ThemeProvider', () => {
		const args = {
			buttonContent: 'click me',
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
	});

	it('is themeable with theme prop', () => {
		const args = {
			buttonContent: 'click me',
			active: true,
		};
		const rendered = render(<Slideout {...args} theme={theme} />);
		const slideoutElement = rendered.container.querySelector('.ss__slideout')!;
		const styles = getComputedStyle(slideoutElement);
		expect(styles.maxWidth).toBe(theme.components.slideout.width);
	});

	it('is themeable with theme  prop overrides ThemeProvider', () => {
		const args = {
			buttonContent: 'click me',
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
	});
});

import { h } from 'preact';

import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { Overlay } from './Overlay';
import { ThemeProvider } from '../../../providers';

describe('Overlay Component', () => {
	const theme = {
		components: {
			overlay: {
				color: 'rgba(200, 100, 50, 0.5)',
			},
		},
	};

	it('renders', () => {
		const args = { active: true };
		const rendered = render(<Overlay {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__overlay');
		expect(overlayElement).toBeInTheDocument();
	});

	it('is hidden when inactive', () => {
		const args = { active: false };
		const rendered = render(<Overlay {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__overlay.ss__overlay--active');
		expect(overlayElement).not.toBeInTheDocument();
	});

	it('is has custom color', () => {
		const args = {
			active: true,
			color: 'rgba(0, 0, 0, 0.3)',
		};
		const rendered = render(<Overlay {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__overlay');
		const styles = getComputedStyle(overlayElement);
		expect(styles.backgroundColor).toBe(args.color);
	});

	it('can disable styling', () => {
		const args = {
			active: true,
			disableStyles: true,
		};
		const rendered = render(<Overlay {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__overlay');
		const styles = getComputedStyle(overlayElement);
		expect(styles.backgroundColor).toBe('');
		expect(overlayElement.classList.length).toBe(3);
		expect(overlayElement.classList).toContain('css-0');
	});

	it('can custom className', () => {
		const args = {
			active: true,
			className: 'custom-class',
		};
		const rendered = render(<Overlay {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__overlay');
		expect(overlayElement.classList).toContain(args.className);
	});

	it('fires onClick prop when clicked', () => {
		const args = {
			active: true,
			onClick: jest.fn(),
		};
		const rendered = render(<Overlay {...args} />);
		const overlayElement = rendered.container.querySelector('.ss__overlay');
		userEvent.click(overlayElement);
		expect(args.onClick).toHaveBeenCalled();
	});

	it('is themeable with ThemeProvider', () => {
		const args = { active: true };
		const rendered = render(
			<ThemeProvider theme={theme}>
				<Overlay {...args} />
			</ThemeProvider>
		);
		const overlayElement = rendered.container.querySelector('.ss__overlay');
		const styles = getComputedStyle(overlayElement);
		expect(styles.backgroundColor).toBe(theme.components.overlay.color);
	});

	it('is themeable with theme prop', () => {
		const args = { active: true };
		const rendered = render(<Overlay {...args} theme={theme} />);
		const overlayElement = rendered.container.querySelector('.ss__overlay');
		const styles = getComputedStyle(overlayElement);
		expect(styles.backgroundColor).toBe(theme.components.overlay.color);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const args = { active: true };
		const themeOverride = {
			components: {
				overlay: {
					color: 'rgba(100, 100, 100, 0.9)',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<Overlay {...args} theme={themeOverride} />
			</ThemeProvider>
		);
		const overlayElement = rendered.container.querySelector('.ss__overlay');
		const styles = getComputedStyle(overlayElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.overlay.color);
		expect(styles.backgroundColor).not.toBe(theme.components.overlay.color);
	});
});

import { h } from 'preact';
import { render } from '@testing-library/preact';

import { LoadingBar } from './LoadingBar';
import { ThemeProvider } from '../../../providers';

describe('LoadingBar Component', () => {
	const theme = {
		components: {
			loadingBar: {
				color: 'rgb(200, 100, 50)',
			},
		},
	};

	it('renders', () => {
		const args = {
			active: true,
		};
		const rendered = render(<LoadingBar {...args} />);
		const loadingbarElement = rendered.container.querySelector('.ss__loading-bar');
		expect(loadingbarElement).toBeInTheDocument();
		expect(loadingbarElement?.classList.length).toBe(2);
	});

	it('displays loading bar when active', () => {
		const args = {
			active: true,
		};
		const rendered = render(<LoadingBar {...args} />);
		const loadingbarElement = rendered.container.querySelector('.ss__loading-bar');
		expect(loadingbarElement).toBeInTheDocument();
	});

	it('hides loading bar when inactive', () => {
		const args = {
			active: false,
		};
		const rendered = render(<LoadingBar {...args} />);
		const loadingbarElement = rendered.container.querySelector('.ss__loading-bar');
		expect(loadingbarElement).not.toBeInTheDocument();
	});

	it('uses custom height', () => {
		const args = {
			active: true,
			height: '10px',
		};
		const rendered = render(<LoadingBar {...args} />);
		const loadingbarElement = rendered.container.querySelector('.ss__loading-bar')!;
		const styles = getComputedStyle(loadingbarElement);
		expect(styles.height).toBe(args.height);
	});

	it('can use custom colors', () => {
		const args = {
			active: true,
			color: 'blue',
			backgroundColor: 'rgb(204, 204, 204)',
		};
		const rendered = render(<LoadingBar {...args} />);
		const loadingbarElement = rendered.container.querySelector('.ss__loading-bar')!;
		const loadingbarElementStyles = getComputedStyle(loadingbarElement);
		expect(loadingbarElementStyles.background).toBe(args.backgroundColor);

		const barElement = loadingbarElement.querySelector('.ss__loading-bar__bar')!;
		const barElementStyles = getComputedStyle(barElement);
		expect(barElementStyles.background).toBe(args.color);
	});

	it('can disable styling', () => {
		const args = {
			active: true,
			disableStyles: true,
		};
		const rendered = render(<LoadingBar {...args} />);
		const loadingbarElement = rendered.container.querySelector('.ss__loading-bar');
		expect(loadingbarElement?.classList.length).toBe(1);
	});

	it('can custom className', () => {
		const args = {
			active: true,
			className: 'custom-class',
		};
		const rendered = render(<LoadingBar {...args} />);
		const loadingbarElement = rendered.container.querySelector('.ss__loading-bar');
		expect(loadingbarElement?.classList).toContain(args.className);
	});

	it('is themeable with ThemeProvider', () => {
		const args = { active: true };
		const rendered = render(
			<ThemeProvider theme={theme}>
				<LoadingBar {...args} />
			</ThemeProvider>
		);
		const loadingbarElement = rendered.container.querySelector('.ss__loading-bar .ss__loading-bar__bar')!;
		const styles = getComputedStyle(loadingbarElement);
		expect(styles.backgroundColor).toBe(theme.components.loadingBar.color);
	});

	it('is themeable with theme prop', () => {
		const args = { active: true };
		const rendered = render(<LoadingBar {...args} theme={theme} />);
		const loadingbarElement = rendered.container.querySelector('.ss__loading-bar .ss__loading-bar__bar')!;
		const styles = getComputedStyle(loadingbarElement);
		expect(styles.backgroundColor).toBe(theme.components.loadingBar.color);
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const args = { active: true };
		const themeOverride = {
			components: {
				loadingBar: {
					color: 'rgb(123, 123, 123)',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={theme}>
				<LoadingBar {...args} theme={themeOverride} />
			</ThemeProvider>
		);
		const loadingbarElement = rendered.container.querySelector('.ss__loading-bar .ss__loading-bar__bar')!;
		const styles = getComputedStyle(loadingbarElement);
		expect(styles.backgroundColor).toBe(themeOverride.components.loadingBar.color);
	});
});

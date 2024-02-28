import { h } from 'preact';

import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { BadgeText } from './BadgeText';

const BADGE_LABEL = 'example badge';

describe('BadgeText Component', () => {
	it('renders BadgeText with label text', () => {
		const rendered = render(<BadgeText label={BADGE_LABEL} />);
		const BadgeTextEl = rendered.container.querySelector('.ss__badge-text')!;
		expect(BadgeTextEl).toBeInTheDocument();
		expect(BadgeTextEl).toHaveTextContent(BADGE_LABEL);

		const styles = getComputedStyle(BadgeTextEl);

		expect(styles.background).toBeDefined();
		expect(styles.color).toBeDefined();
	});

	it('renders BadgeText with color and colorText props', () => {
		const color = 'rgb(255, 0, 0)';
		const colorText = 'rgb(14, 14, 14)';

		const rendered = render(<BadgeText label={BADGE_LABEL} color={color} colorText={colorText} />);
		const BadgeTextEl = rendered.container.querySelector('.ss__badge-text')!;
		expect(BadgeTextEl).toBeInTheDocument();

		const styles = getComputedStyle(BadgeTextEl);

		expect(styles.background).toBe(color);
		expect(styles.color).toBe(colorText);
	});

	it('renders BadgeText with overflow prop true', () => {
		const rendered = render(<BadgeText label={BADGE_LABEL} overflow={true} />);
		const BadgeTextEl = rendered.container.querySelector('.ss__badge-text')!;
		expect(BadgeTextEl).toBeInTheDocument();

		const styles = getComputedStyle(BadgeTextEl);

		expect(styles.textOverflow).toBe('ellipsis');
		expect(styles.whiteSpace).toBe('nowrap');
		expect(styles.overflow).toBe('hidden');
		expect(styles.maxWidth).toBe('200%');
	});

	it('renders BadgeText with overflow prop false', () => {
		const rendered = render(<BadgeText label={BADGE_LABEL} overflow={false} />);
		const BadgeTextEl = rendered.container.querySelector('.ss__badge-text')!;
		expect(BadgeTextEl).toBeInTheDocument();

		const styles = getComputedStyle(BadgeTextEl);

		expect(styles.textOverflow).toBe('');
		expect(styles.whiteSpace).toBe('');
		expect(styles.overflow).toBe('');
		expect(styles.maxWidth).toBe('');
	});

	describe('BadgeText theming works', () => {
		it('is themeable with ThemeProvider', () => {
			const globalTheme = {
				components: {
					badgeText: {
						className: 'classy',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<BadgeText label={BADGE_LABEL} />
				</ThemeProvider>
			);
			const element = rendered.container.querySelector('.ss__badge-text');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(globalTheme.components.badgeText.className);
		});

		it('is themeable with theme prop', () => {
			const propTheme = {
				components: {
					badgeText: {
						className: 'classy',
					},
				},
			};
			const rendered = render(<BadgeText label={BADGE_LABEL} theme={propTheme} />);
			const element = rendered.container.querySelector('.ss__badge-text');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.badgeText.className);
		});

		it('is theme prop overrides ThemeProvider', () => {
			const globalTheme = {
				components: {
					badgeText: {
						className: 'classy',
						label: 'oooo',
					},
				},
			};
			const propTheme = {
				components: {
					badgeText: {
						className: 'classier',
						label: 'ahhhh',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<BadgeText label={BADGE_LABEL} theme={propTheme} />
				</ThemeProvider>
			);

			const element = rendered.container.querySelector('.ss__badge-text');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.badgeText.className);
			expect(element).not.toHaveClass(globalTheme.components.badgeText.className);
			expect(element).toHaveTextContent(propTheme.components.badgeText.label);
			expect(element).not.toHaveTextContent(globalTheme.components.badgeText.label);
		});
	});
});

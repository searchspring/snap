import { h } from 'preact';

import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { BadgePill } from './BadgePill';

const BADGE_VALUE = 'example badge';

describe('BadgePill Component', () => {
	it('renders BadgePill with value text', () => {
		const rendered = render(<BadgePill value={BADGE_VALUE} />);
		const BadgePillEl = rendered.container.querySelector('.ss__badge-pill')!;
		expect(BadgePillEl).toBeInTheDocument();
		expect(BadgePillEl).toHaveTextContent(BADGE_VALUE);

		const styles = getComputedStyle(BadgePillEl);

		expect(styles.background).toBeDefined();
		expect(styles.color).toBeDefined();
	});

	it('renders BadgePill with color and colorText props', () => {
		const color = 'rgb(255, 0, 0)';
		const colorText = 'rgb(14, 14, 14)';

		const rendered = render(<BadgePill value={BADGE_VALUE} color={color} colorText={colorText} />);
		const BadgePillEl = rendered.container.querySelector('.ss__badge-pill')!;
		expect(BadgePillEl).toBeInTheDocument();

		const styles = getComputedStyle(BadgePillEl);

		expect(styles.background).toBe(color);
		expect(styles.color).toBe(colorText);
	});

	it('renders BadgePill with tag class', () => {
		const tag = 'example-tag';
		const rendered = render(<BadgePill tag={tag} value={BADGE_VALUE} />);
		const BadgePillEl = rendered.container.querySelector('.ss__badge-pill')!;
		expect(BadgePillEl).toBeInTheDocument();
		expect(BadgePillEl).toHaveClass(`ss__badge-pill--${tag}`);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<BadgePill className={className} value={BADGE_VALUE} />);
		const BadgePillEl = rendered.container.querySelector('.ss__badge-pill')!;
		expect(BadgePillEl).toHaveClass(className);
	});

	it('disables styles', () => {
		const rendered = render(<BadgePill disableStyles value={BADGE_VALUE} />);
		const BadgePillEl = rendered.container.querySelector('.ss__badge-pill')!;

		expect(BadgePillEl?.classList).toHaveLength(2);
	});

	describe('BadgePill theming works', () => {
		it('is themeable with ThemeProvider', () => {
			const globalTheme = {
				components: {
					badgePill: {
						className: 'classy',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<BadgePill value={BADGE_VALUE} />
				</ThemeProvider>
			);
			const element = rendered.container.querySelector('.ss__badge-pill');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(globalTheme.components.badgePill.className);
		});

		it('is themeable with theme prop', () => {
			const propTheme = {
				components: {
					badgePill: {
						className: 'classy',
					},
				},
			};
			const rendered = render(<BadgePill value={BADGE_VALUE} theme={propTheme} />);
			const element = rendered.container.querySelector('.ss__badge-pill');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.badgePill.className);
		});

		it('is theme prop overrides ThemeProvider', () => {
			const globalTheme = {
				components: {
					badgePill: {
						className: 'classy',
						value: 'oooo',
					},
				},
			};
			const propTheme = {
				components: {
					badgePill: {
						className: 'classier',
						value: 'ahhhh',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<BadgePill value={BADGE_VALUE} theme={propTheme} />
				</ThemeProvider>
			);

			const element = rendered.container.querySelector('.ss__badge-pill');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.badgePill.className);
			expect(element).not.toHaveClass(globalTheme.components.badgePill.className);
			expect(element).toHaveTextContent(propTheme.components.badgePill.value);
			expect(element).not.toHaveTextContent(globalTheme.components.badgePill.value);
		});
	});
});

import { h } from 'preact';

import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { BadgeRectangle } from './BadgeRectangle';

const BADGE_VALUE = 'example badge';

describe('BadgeRectangle Component', () => {
	it('renders BadgeRectangle with value text', () => {
		const rendered = render(<BadgeRectangle value={BADGE_VALUE} />);
		const BadgeRectangleEl = rendered.container.querySelector('.ss__badge-rectangle')!;
		expect(BadgeRectangleEl).toBeInTheDocument();
		expect(BadgeRectangleEl).toHaveTextContent(BADGE_VALUE);

		const styles = getComputedStyle(BadgeRectangleEl);

		expect(styles.background).toBeDefined();
		expect(styles.color).toBeDefined();
	});

	it('renders BadgeRectangle with color and colorText props', () => {
		const color = 'rgb(255, 0, 0)';
		const colorText = 'rgb(14, 14, 14)';

		const rendered = render(<BadgeRectangle value={BADGE_VALUE} color={color} colorText={colorText} />);
		const BadgeRectangleEl = rendered.container.querySelector('.ss__badge-rectangle')!;
		expect(BadgeRectangleEl).toBeInTheDocument();

		const styles = getComputedStyle(BadgeRectangleEl);

		expect(styles.background).toBe(color);
		expect(styles.color).toBe(colorText);
	});

	it('renders BadgeRectangle with tag class', () => {
		const tag = 'example-tag';
		const rendered = render(<BadgeRectangle tag={tag} value={BADGE_VALUE} />);
		const BadgeRectangleEl = rendered.container.querySelector('.ss__badge-rectangle')!;
		expect(BadgeRectangleEl).toBeInTheDocument();
		expect(BadgeRectangleEl).toHaveClass(`ss__badge-rectangle--${tag}`);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<BadgeRectangle className={className} value={BADGE_VALUE} />);
		const BadgeRectangleEl = rendered.container.querySelector('.ss__badge-rectangle')!;

		expect(BadgeRectangleEl).toHaveClass(className);
	});

	it('disables styles', () => {
		const rendered = render(<BadgeRectangle disableStyles value={BADGE_VALUE} />);
		const BadgeRectangleEl = rendered.container.querySelector('.ss__badge-rectangle')!;

		expect(BadgeRectangleEl?.classList).toHaveLength(2);
	});

	describe('BadgeRectangle theming works', () => {
		it('is themeable with ThemeProvider', () => {
			const globalTheme = {
				components: {
					badgeRectangle: {
						className: 'classy',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<BadgeRectangle value={BADGE_VALUE} />
				</ThemeProvider>
			);
			const element = rendered.container.querySelector('.ss__badge-rectangle');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(globalTheme.components.badgeRectangle.className);
		});

		it('is themeable with theme prop', () => {
			const propTheme = {
				components: {
					badgeRectangle: {
						className: 'classy',
					},
				},
			};
			const rendered = render(<BadgeRectangle value={BADGE_VALUE} theme={propTheme} />);
			const element = rendered.container.querySelector('.ss__badge-rectangle');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.badgeRectangle.className);
		});

		it('is theme prop overrides ThemeProvider', () => {
			const globalTheme = {
				components: {
					badgeRectangle: {
						className: 'classy',
						value: 'oooo',
					},
				},
			};
			const propTheme = {
				components: {
					badgeRectangle: {
						className: 'classier',
						value: 'ahhhh',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<BadgeRectangle value={BADGE_VALUE} theme={propTheme} />
				</ThemeProvider>
			);

			const element = rendered.container.querySelector('.ss__badge-rectangle');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.badgeRectangle.className);
			expect(element).not.toHaveClass(globalTheme.components.badgeRectangle.className);
			expect(element).toHaveTextContent(propTheme.components.badgeRectangle.value);
			expect(element).not.toHaveTextContent(globalTheme.components.badgeRectangle.value);
		});
	});
});

import { h } from 'preact';

import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { BadgeText } from './BadgeText';

const BADGE_VALUE = 'example badge';

describe('BadgeText Component', () => {
	it('renders BadgeText with value text', () => {
		const rendered = render(<BadgeText value={BADGE_VALUE} />);
		const BadgeTextEl = rendered.container.querySelector('.ss__badge-text')!;
		expect(BadgeTextEl).toBeInTheDocument();
		expect(BadgeTextEl).toHaveTextContent(BADGE_VALUE);
	});

	it('renders BadgeText with colorText prop', () => {
		const colorText = 'rgb(14, 14, 14)';

		const rendered = render(<BadgeText value={BADGE_VALUE} colorText={colorText} />);
		const BadgeTextEl = rendered.container.querySelector('.ss__badge-text')!;
		expect(BadgeTextEl).toBeInTheDocument();

		const styles = getComputedStyle(BadgeTextEl);

		expect(styles.color).toBe(colorText);
	});

	it('renders BadgeText with tag class', () => {
		const tag = 'example-tag';
		const rendered = render(<BadgeText tag={tag} value={BADGE_VALUE} />);
		const BadgeTextEl = rendered.container.querySelector('.ss__badge-text')!;
		expect(BadgeTextEl).toBeInTheDocument();
		expect(BadgeTextEl).toHaveClass(`ss__badge-text--${tag}`);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<BadgeText className={className} value={BADGE_VALUE} />);
		const BadgeTextEl = rendered.container.querySelector('.ss__badge-text')!;

		expect(BadgeTextEl).toHaveClass(className);
	});

	it('disables styles', () => {
		const rendered = render(<BadgeText disableStyles value={BADGE_VALUE} />);
		const BadgeTextEl = rendered.container.querySelector('.ss__badge-text')!;

		expect(BadgeTextEl?.classList).toHaveLength(2);
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
					<BadgeText value={BADGE_VALUE} />
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
			const rendered = render(<BadgeText value={BADGE_VALUE} theme={propTheme} />);
			const element = rendered.container.querySelector('.ss__badge-text');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.badgeText.className);
		});

		it('is theme prop overrides ThemeProvider', () => {
			const globalTheme = {
				components: {
					badgeText: {
						className: 'classy',
						value: 'oooo',
					},
				},
			};
			const propTheme = {
				components: {
					badgeText: {
						className: 'classier',
						value: 'ahhhh',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<BadgeText value={BADGE_VALUE} theme={propTheme} />
				</ThemeProvider>
			);

			const element = rendered.container.querySelector('.ss__badge-text');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.badgeText.className);
			expect(element).not.toHaveClass(globalTheme.components.badgeText.className);
			expect(element).toHaveTextContent(propTheme.components.badgeText.value);
			expect(element).not.toHaveTextContent(globalTheme.components.badgeText.value);
		});
	});
});

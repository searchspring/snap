import { h } from 'preact';

import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { BadgeImage } from './BadgeImage';

const BADGE_URL = '/images/example.png';
const BADGE_LABEL = 'example badge';

describe('BadgeImage Component', () => {
	it('renders BadgeImage with image src and alt text', () => {
		const rendered = render(<BadgeImage url={BADGE_URL} label={BADGE_LABEL} />);
		const BadgeImg = rendered.container.querySelector('.ss__badge-image');
		expect(BadgeImg).toBeInTheDocument();
		expect(BadgeImg).toHaveAttribute('src', BADGE_URL);
		expect(BadgeImg).toHaveAttribute('alt', BADGE_LABEL);
	});

	it('renders BadgeImage with tag class', () => {
		const tag = 'example-tag';
		const rendered = render(<BadgeImage tag={tag} url={BADGE_URL} label={BADGE_LABEL} />);
		const BadgeImg = rendered.container.querySelector('.ss__badge-image');
		expect(BadgeImg).toBeInTheDocument();
		expect(BadgeImg).toHaveClass(`ss__badge-image--${tag}`);
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<BadgeImage className={className} url={BADGE_URL} label={BADGE_LABEL} />);
		const BadgeImg = rendered.container.querySelector('.ss__badge-image');

		expect(BadgeImg).toHaveClass(className);
	});

	it('disables styles', () => {
		const rendered = render(<BadgeImage disableStyles url={BADGE_URL} label={BADGE_LABEL} />);
		const BadgeImg = rendered.container.querySelector('.ss__badge-image');

		expect(BadgeImg?.classList).toHaveLength(2);
	});

	describe('BadgeImage theming works', () => {
		it('is themeable with ThemeProvider', () => {
			const globalTheme = {
				components: {
					badgeImage: {
						className: 'classy',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<BadgeImage url={BADGE_URL} label={BADGE_LABEL} />
				</ThemeProvider>
			);
			const element = rendered.container.querySelector('.ss__badge-image');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(globalTheme.components.badgeImage.className);
		});

		it('is themeable with theme prop', () => {
			const propTheme = {
				components: {
					badgeImage: {
						className: 'classy',
					},
				},
			};
			const rendered = render(<BadgeImage url={BADGE_URL} label={BADGE_LABEL} theme={propTheme} />);
			const element = rendered.container.querySelector('.ss__badge-image');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.badgeImage.className);
		});

		it('is theme prop overrides ThemeProvider', () => {
			const globalTheme = {
				components: {
					badgeImage: {
						className: 'classy',
						label: 'oooo',
					},
				},
			};
			const propTheme = {
				components: {
					badgeImage: {
						className: 'classier',
						label: 'ahhhh',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<BadgeImage url={BADGE_URL} label={BADGE_LABEL} theme={propTheme} />
				</ThemeProvider>
			);

			const element = rendered.container.querySelector('.ss__badge-image');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.badgeImage.className);
			expect(element).not.toHaveClass(globalTheme.components.badgeImage.className);
			expect(element).toHaveAttribute('alt', propTheme.components.badgeImage.label);
			expect(element).not.toHaveAttribute('alt', globalTheme.components.badgeImage.label);
		});
	});
});

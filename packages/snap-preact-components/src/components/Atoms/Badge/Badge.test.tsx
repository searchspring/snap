import { h } from 'preact';

import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers/theme';

import { Badge } from './Badge';

const CONTENT = 'sale';
const CLASSNAME = 'sale-badge';
const CHILDREN = <div>{CONTENT}</div>;

// TODO: Add test to fully cover position prop

describe('Badge Component', () => {
	it('positions badge based on prop', () => {
		const position = { right: 0 };
		const rendered = render(<Badge position={position}>{CHILDREN}</Badge>);
		const badge = rendered.container.querySelector('.ss-badge');
		let styles = getComputedStyle(badge);

		expect(styles.right).toEqual('0px');

		const newPosition = { left: 0 };
		rendered.rerender(<Badge position={newPosition}>{CHILDREN}</Badge>);
		styles = getComputedStyle(badge);

		expect(styles.left).toEqual('0px');
	});

	describe('Badge with content', () => {
		let rendered;
		beforeEach(() => {
			rendered = render(<Badge className={CLASSNAME} content={CONTENT} />);
		});

		it('renders Badge', () => {
			const BadgeElement = rendered.getByText(CONTENT);

			expect(BadgeElement).toBeInTheDocument();
		});

		it('Badge has correct classes', () => {
			const badge = rendered.container.querySelector('.ss-badge');
			expect(badge).toBeInTheDocument();
			expect(badge.classList.length).toBe(3);
			expect(badge.classList[0]).toMatch(/^ss-badge/);
			expect(badge).toHaveClass(CLASSNAME);
		});
	});

	describe('Badge with children', () => {
		let badge;
		beforeEach(() => {
			const position = { right: 0 };
			badge = render(<Badge position={position}>{CHILDREN}</Badge>);
		});

		it('renders Badge', () => {
			const BadgeElement = badge.getByText(CONTENT);

			expect(BadgeElement).toBeInTheDocument();
		});

		it('Badge has correct number of classes', () => {
			const BadgeElement = badge.getByText(CONTENT).parentElement;

			expect(BadgeElement.classList.length).toBe(2);
			expect(BadgeElement.classList[0]).toMatch(/^ss-badge/);
		});
	});

	describe('Badge with disableStyles', () => {
		let badge;
		beforeEach(() => {
			badge = render(<Badge content={CONTENT} disableStyles />);
		});

		it('renders Badge', () => {
			const BadgeElement = badge.getByText(CONTENT);

			expect(BadgeElement).toBeInTheDocument();
		});

		it('Badge has correct number of classes', () => {
			const BadgeElement = badge.getByText(CONTENT);

			expect(BadgeElement.classList.length).toBe(2);
			expect(BadgeElement.classList[1]).toMatch(/^css-0/);
		});
	});

	describe('Badge theming works', () => {
		it('is themeable with ThemeProvider', () => {
			const globalTheme = {
				components: {
					badge: {
						className: 'classy',
					},
				},
			};
			const position = { right: 0 };
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Badge position={position}>{CHILDREN}</Badge>
				</ThemeProvider>
			);
			const element = rendered.container.querySelector('.ss-badge');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(globalTheme.components.badge.className);
		});

		it('is themeable with theme prop', () => {
			const propTheme = {
				components: {
					badge: {
						className: 'classy',
					},
				},
			};
			const position = { right: 0 };
			const rendered = render(
				<Badge position={position} theme={propTheme}>
					{CHILDREN}
				</Badge>
			);
			const element = rendered.container.querySelector('.ss-badge');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.badge.className);
		});

		it('is theme prop overrides ThemeProvider', () => {
			const globalTheme = {
				components: {
					badge: {
						className: 'classy',
						content: 'oooo',
					},
				},
			};
			const propTheme = {
				components: {
					badge: {
						className: 'classier',
						content: 'ahhhh',
					},
				},
			};
			const position = { right: 0 };
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Badge position={position} theme={propTheme}>
						{CHILDREN}
					</Badge>
				</ThemeProvider>
			);

			const element = rendered.container.querySelector('.ss-badge');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.badge.className);
			expect(element).not.toHaveClass(globalTheme.components.badge.className);
			expect(element).toHaveTextContent(propTheme.components.badge.content);
			expect(element).not.toHaveTextContent(globalTheme.components.badge.content);
		});
	});
});

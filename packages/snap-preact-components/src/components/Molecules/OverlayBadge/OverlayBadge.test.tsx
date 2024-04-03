import { h } from 'preact';

import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { OverlayBadge } from './OverlayBadge';

import { MockClient } from '@searchspring/snap-shared';

import { SearchControllerConfig } from '@searchspring/snap-controller';
import { createSearchController } from '@searchspring/snap-preact';
import { Product } from '@searchspring/snap-store-mobx';

const globals = { siteId: '8uyt2m' };
const clientConfig = {
	globals: {
		siteId: '8uyt2m',
	},
};
const searchConfig: SearchControllerConfig = {
	id: 'search',
};
const CHILDREN = <div className="children">children</div>;
// const OVERLAY_NAME = 'left-middle';
const mockClient = new MockClient(globals, {});
const controller = createSearchController({ client: clientConfig, controller: searchConfig }, { client: mockClient });

describe('OverlayBadge Component', () => {
	let result: Product;
	beforeAll(async () => {
		expect(controller).toBeDefined();
		expect(controller.store.meta).toBeDefined();

		await controller.search();
		result = (controller.store.results as Product[]).find((result) => {
			return result.badges.overlay.length > 0;
		})! as Product;
		expect(result).toBeDefined();
	});

	it('renders OverlayBadge', () => {
		const rendered = render(
			<OverlayBadge controller={controller} result={result}>
				{CHILDREN}
			</OverlayBadge>
		);
		const OverlayBadgeEl = rendered.container.querySelector('.ss__overlay-badge')!;
		expect(OverlayBadgeEl).toBeInTheDocument();

		const OverlayBadgeComponentEl = rendered.container.querySelector(`.ss__overlay-badge--${result.badges.overlay[0].tag}`)!;

		expect(OverlayBadgeComponentEl).toBeInTheDocument();

		expect(OverlayBadgeComponentEl.classList.contains(`ss__overlay-badge--${result.badges.overlay[0].location}`)).toBe(true);
		expect(OverlayBadgeComponentEl.classList.contains(`ss__overlay-badge__${result.badges.overlay[0].component}`)).toBe(true);
		expect(
			OverlayBadgeComponentEl.classList.contains(`ss__overlay-badge__${result.badges.overlay[0].component}--${result.badges.overlay[0].location}`)
		).toBe(true);
		expect(
			OverlayBadgeComponentEl.classList.contains(`ss__overlay-badge__${result.badges.overlay[0].component}--${result.badges.overlay[0].tag}`)
		).toBe(true);

		const ChildrenEl = rendered.container.querySelector(`.children`)!;
		expect(ChildrenEl).toBeInTheDocument();
	});

	it('can use componentMap to render a custom component', () => {
		const componentName = 'TestComponent';
		const customComponentClassName = 'custom-component-class';

		const result2 = result;
		result2.badges.overlay[0].component = componentName;

		const rendered = render(
			<OverlayBadge
				controller={controller}
				result={result2}
				componentMap={{
					[componentName]: () => () => <div className={customComponentClassName}>test</div>,
				}}
			>
				{CHILDREN}
			</OverlayBadge>
		);

		const OverlayBadgeCustomComponent = rendered.container.querySelector(`.${customComponentClassName}`)!;
		expect(OverlayBadgeCustomComponent).toBeInTheDocument();
	});

	describe('OverlayBadge theming works', () => {
		it('is themeable with ThemeProvider', () => {
			const globalTheme = {
				components: {
					overlayBadge: {
						className: 'classy',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<OverlayBadge controller={controller} result={result}>
						{CHILDREN}
					</OverlayBadge>
				</ThemeProvider>
			);
			const element = rendered.container.querySelector('.ss__overlay-badge');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(globalTheme.components.overlayBadge.className);
		});

		it('is themeable with theme prop', () => {
			const propTheme = {
				components: {
					overlayBadge: {
						className: 'classy',
					},
				},
			};
			const rendered = render(
				<OverlayBadge controller={controller} result={result} theme={propTheme}>
					{CHILDREN}
				</OverlayBadge>
			);
			const element = rendered.container.querySelector('.ss__overlay-badge');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.overlayBadge.className);
		});

		it('is theme prop overrides ThemeProvider', () => {
			const globalTheme = {
				components: {
					overlayBadge: {
						className: 'classy',
					},
				},
			};
			const propTheme = {
				components: {
					overlayBadge: {
						className: 'classier',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<OverlayBadge controller={controller} result={result} theme={propTheme}>
						{CHILDREN}
					</OverlayBadge>
				</ThemeProvider>
			);

			const element = rendered.container.querySelector('.ss__overlay-badge');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.overlayBadge.className);
			expect(element).not.toHaveClass(globalTheme.components.overlayBadge.className);
		});
	});
});

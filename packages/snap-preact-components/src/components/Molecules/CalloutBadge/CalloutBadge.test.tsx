import { h } from 'preact';

import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { CalloutBadge } from './CalloutBadge';

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
const CALLOUT_NAME = 'callout';
const mockClient = new MockClient(globals, {});
const controller = createSearchController({ client: clientConfig, controller: searchConfig }, { client: mockClient });

describe('CalloutBadge Component', () => {
	let result: Product;
	beforeAll(async () => {
		expect(controller).toBeDefined();
		expect(controller.store.meta).toBeDefined();

		await controller.search();
		result = (controller.store.results as Product[]).find((result) => result.badges.callout[CALLOUT_NAME])! as Product;
		expect(result).toBeDefined();
	});

	it('renders CalloutBadge', () => {
		const rendered = render(<CalloutBadge result={result} name={CALLOUT_NAME} />);
		const CalloutBadgeEl = rendered.container.querySelector('.ss__callout-badge')!;
		expect(CalloutBadgeEl).toBeInTheDocument();

		const CalloutBadgeComponentEl = rendered.container.querySelector(`.ss__callout-badge--${result.badges.callout[CALLOUT_NAME].tag}`)!;
		expect(CalloutBadgeComponentEl).toBeInTheDocument();

		expect(CalloutBadgeComponentEl.classList.contains(`ss__callout-badge--${result.badges.callout[CALLOUT_NAME].location}`)).toBe(true);
		expect(CalloutBadgeComponentEl.classList.contains(`ss__callout-badge__${result.badges.callout[CALLOUT_NAME].component}`)).toBe(true);
		expect(
			CalloutBadgeComponentEl.classList.contains(
				`ss__callout-badge__${result.badges.callout[CALLOUT_NAME].component}--${result.badges.callout[CALLOUT_NAME].location}`
			)
		).toBe(true);
		expect(
			CalloutBadgeComponentEl.classList.contains(
				`ss__callout-badge__${result.badges.callout[CALLOUT_NAME].component}--${result.badges.callout[CALLOUT_NAME].tag}`
			)
		).toBe(true);
	});

	it('can use componentMap to render a custom component', () => {
		const componentName = 'TestComponent';
		const customComponentClassName = 'custom-component-class';

		const result2 = result;
		result2.badges.callout[CALLOUT_NAME].component = componentName;

		const rendered = render(
			<CalloutBadge
				result={result2}
				name={CALLOUT_NAME}
				componentMap={{
					[componentName]: () => () => <div className={customComponentClassName}>test</div>,
				}}
			/>
		);

		const CalloutBadgeCustomComponent = rendered.container.querySelector(`.${customComponentClassName}`)!;
		expect(CalloutBadgeCustomComponent).toBeInTheDocument();
	});

	describe('CalloutBadge theming works', () => {
		it('is themeable with ThemeProvider', () => {
			const globalTheme = {
				components: {
					calloutBadge: {
						className: 'classy',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<CalloutBadge result={result} name={CALLOUT_NAME} />
				</ThemeProvider>
			);
			const element = rendered.container.querySelector('.ss__callout-badge');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(globalTheme.components.calloutBadge.className);
		});

		it('is themeable with theme prop', () => {
			const propTheme = {
				components: {
					calloutBadge: {
						className: 'classy',
					},
				},
			};
			const rendered = render(<CalloutBadge result={result} name={CALLOUT_NAME} theme={propTheme} />);
			const element = rendered.container.querySelector('.ss__callout-badge');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.calloutBadge.className);
		});

		it('is theme prop overrides ThemeProvider', () => {
			const globalTheme = {
				components: {
					calloutBadge: {
						className: 'classy',
					},
				},
			};
			const propTheme = {
				components: {
					calloutBadge: {
						className: 'classier',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<CalloutBadge result={result} name={CALLOUT_NAME} theme={propTheme} />
				</ThemeProvider>
			);

			const element = rendered.container.querySelector('.ss__callout-badge');
			expect(element).toBeInTheDocument();
			expect(element).toHaveClass(propTheme.components.calloutBadge.className);
			expect(element).not.toHaveClass(globalTheme.components.calloutBadge.className);
		});
	});
});
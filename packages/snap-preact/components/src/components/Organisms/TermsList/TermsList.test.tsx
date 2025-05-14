import { h } from 'preact';

import { v4 as uuidv4 } from 'uuid';
import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { TermsList } from './TermsList';
import { AutocompleteController, AutocompleteControllerConfig } from '@searchspring/snap-controller';
import { createAutocompleteController } from '../../../../../src/create';
import { MockClient } from '@searchspring/snap-shared';
import { AutocompleteTermStore } from '@searchspring/snap-store-mobx';
import { UrlManager } from '@searchspring/snap-url-manager';

describe('termsList Component', () => {
	const globals = { siteId: '8uyt2m' };
	let controllerConfigId = uuidv4().split('-').join('');
	let acConfig: AutocompleteControllerConfig = {
		id: controllerConfigId,
		selector: 'input.searchspring-ac',
		settings: {
			trending: {
				limit: 5,
			},
			history: {
				limit: 5,
			},
		},
	};
	const clientConfig = {
		globals: {
			siteId: '8uyt2m',
		},
	};

	const mockClient = new MockClient(globals, {});
	mockClient.mockData.updateConfig({ meta: 'ac.meta' });

	let mockTerms: AutocompleteTermStore = [
		{
			active: false,
			preview: jest.fn(),
			value: 'dress',
			url: {
				href: 'www.dress.com',
			} as UrlManager,
		},
		{
			active: false,
			preview: jest.fn(),
			value: 'drss',
			url: {
				href: 'www.drss.com',
			} as UrlManager,
		},
		{
			active: false,
			preview: jest.fn(),
			value: 'dreees',
			url: {
				href: 'www.dreees.com',
			} as UrlManager,
		},
		{
			active: false,
			preview: jest.fn(),
			value: 'dres',
			url: {
				href: 'www.dres.com',
			} as UrlManager,
		},
		{
			active: false,
			preview: jest.fn(),
			value: 'dss',
			url: {
				href: 'www.dss.com',
			} as UrlManager,
		},
		{
			active: false,
			preview: jest.fn(),
			value: 'ress',
			url: {
				href: 'www.ress.com',
			} as UrlManager,
		},
	];

	let controller: AutocompleteController;
	beforeEach(async () => {
		controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		controller.store.terms = mockTerms;
		controller.store.history = mockTerms;
		controller.store.trending = mockTerms;
		await controller.bind();
	});

	it('renders', async () => {
		const rendered = render(<TermsList controller={controller} />);
		const termsList = rendered.container.querySelector('.ss__terms-list');
		expect(termsList).toBeInTheDocument();
	});

	it('has expected default order', async () => {
		const rendered = render(<TermsList controller={controller} />);
		const termList = rendered.container.querySelector('.ss__terms-list');
		const terms = rendered.container.querySelectorAll('.ss__terms');
		expect(termList).toBeInTheDocument();

		expect(terms[0].classList).toContain('ss__terms-list__terms--suggestions');
		expect(terms[1].classList).toContain('ss__terms-list__terms--trending');
		expect(terms[2].classList).toContain('ss__terms-list__terms--history');
	});

	it('can modify layout order', async () => {
		const rendered = render(<TermsList controller={controller} layout={['Suggestions', 'History', 'Trending']} />);
		const termList = rendered.container.querySelector('.ss__terms-list');
		const terms = rendered.container.querySelectorAll('.ss__terms');
		expect(termList).toBeInTheDocument();

		expect(terms[0].classList).toContain('ss__terms-list__terms--suggestions');
		expect(terms[1].classList).toContain('ss__terms-list__terms--history');
		expect(terms[2].classList).toContain('ss__terms-list__terms--trending');
	});

	it('can exclude history', async () => {
		const rendered = render(<TermsList controller={controller} layout={['Suggestions', 'Trending']} />);
		const termList = rendered.container.querySelector('.ss__terms-list');
		const terms = rendered.container.querySelectorAll('.ss__terms');
		const history = rendered.container.querySelector('.ss__terms-list__terms--history');
		expect(termList).toBeInTheDocument();
		expect(terms[0].classList).toContain('ss__terms-list__terms--suggestions');
		expect(terms[1].classList).toContain('ss__terms-list__terms--trending');
		expect(history).not.toBeInTheDocument();
	});

	it('can exclude Suggestions', async () => {
		const rendered = render(<TermsList controller={controller} layout={['History', 'Trending']} />);
		const termList = rendered.container.querySelector('.ss__terms-list');
		const terms = rendered.container.querySelectorAll('.ss__terms');
		const suggested = rendered.container.querySelector('.ss__terms-list__terms--suggestions');
		expect(termList).toBeInTheDocument();
		expect(terms[0].classList).toContain('ss__terms-list__terms--history');
		expect(terms[1].classList).toContain('ss__terms-list__terms--trending');
		expect(suggested).not.toBeInTheDocument();
	});

	it('can exclude Trending', async () => {
		const rendered = render(<TermsList controller={controller} layout={['Suggestions', 'History']} />);
		const termList = rendered.container.querySelector('.ss__terms-list');
		const terms = rendered.container.querySelectorAll('.ss__terms');
		const trending = rendered.container.querySelector('.ss__terms-list__terms--trending');
		expect(termList).toBeInTheDocument();
		expect(terms[0].classList).toContain('ss__terms-list__terms--suggestions');
		expect(terms[1].classList).toContain('ss__terms-list__terms--history');
		expect(trending).not.toBeInTheDocument();
	});

	it('renders with classname', () => {
		const className = 'classy';
		const rendered = render(<TermsList controller={controller} className={className} />);
		const termsList = rendered.container.querySelector('.ss__terms-list');

		expect(termsList).toHaveClass(className);
	});

	it('disables styles', () => {
		const rendered = render(<TermsList controller={controller} disableStyles />);
		const termsList = rendered.container.querySelector('.ss__terms-list');

		expect(termsList?.classList).toHaveLength(1);
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				termsList: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<TermsList controller={controller} />
			</ThemeProvider>
		);
		const termsList = rendered.container.querySelector('.ss__terms-list');
		expect(termsList).toBeInTheDocument();
		expect(termsList?.classList.length).toBe(1);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				termsList: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(<TermsList controller={controller} theme={propTheme} />);
		const termsList = rendered.container.querySelector('.ss__terms-list');
		expect(termsList).toBeInTheDocument();
		expect(termsList?.classList.length).toBe(1);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				termsList: {
					disableStyles: false,
				},
			},
		};
		const propTheme = {
			components: {
				termsList: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<TermsList controller={controller} theme={propTheme} />
			</ThemeProvider>
		);

		const termsList = rendered.container.querySelector('.ss__terms-list');
		expect(termsList).toBeInTheDocument();
		expect(termsList?.classList.length).toBe(1);
	});
});

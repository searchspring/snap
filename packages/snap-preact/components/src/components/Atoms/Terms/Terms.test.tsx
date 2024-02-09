import { h } from 'preact';

import { v4 as uuidv4 } from 'uuid';
import { render, waitFor } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { Terms } from './Terms';
import { AutocompleteController, AutocompleteControllerConfig } from '@searchspring/snap-controller';
import { createAutocompleteController } from '@searchspring/snap-preact';
import { MockClient } from '@searchspring/snap-shared';
import userEvent from '@testing-library/user-event';

import { AutocompleteTermStore } from '@searchspring/snap-store-mobx';
import { UrlManager } from '@searchspring/snap-url-manager';

describe('Terms Component', () => {
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
		await controller.bind();
	});

	it('renders', async () => {
		const rendered = render(<Terms controller={controller} terms={mockTerms} />);
		const terms = rendered.container.querySelector('.ss__terms');
		expect(terms).toBeInTheDocument();
	});

	it('renders with terms just in controller', async () => {
		const modded = controller;
		modded.store.terms = mockTerms;
		const rendered = render(<Terms controller={controller} />);
		const terms = rendered.container.querySelector('.ss__terms');
		expect(terms).toBeInTheDocument();
	});

	it('doesnt render with no controller or terms', async () => {
		const rendered = render(<Terms />);
		const terms = rendered.container.querySelector('.ss__terms');
		expect(terms).not.toBeInTheDocument();
	});

	it('Can use emify', async () => {
		document.body.innerHTML = '<div>' + '  <input type="text" class="searchspring-ac">' + '<div id="target"></div></div>';
		mockClient.mockData.updateConfig({ autocomplete: 'default' });

		const input = document.querySelector('.searchspring-ac');
		expect(input).toBeInTheDocument();

		await controller.bind();

		userEvent.type(input!, 'dre');

		const rendered = render(<Terms controller={controller} terms={mockTerms} emIfy={true} />);
		const termOptions = rendered.container.querySelectorAll('.ss__terms__option a')[0];

		expect(termOptions?.innerHTML).toBe('dre<em>ss</em>');
	});

	it('passed in terms take priority over controller terms', async () => {
		const modded = controller;
		modded.store.terms = [...mockTerms].reverse();
		const rendered = render(<Terms controller={modded} terms={mockTerms} />);
		const termOptions = rendered.container.querySelectorAll('.ss__terms__option a');
		termOptions.forEach((option, index) => {
			expect(option).toBeInTheDocument();
			expect(option.innerHTML).toEqual(mockTerms[index].value);
			expect(option.innerHTML).not.toEqual(modded.store.terms[index].value);
		});
	});

	it('renders with a title', async () => {
		const title = 'Suggestions';
		const rendered = render(<Terms controller={controller} terms={mockTerms} title={title} />);
		const terms = rendered.container.querySelector('.ss__terms');
		const titleElem = rendered.container.querySelector('.ss__terms__title');
		expect(terms).toBeInTheDocument();
		expect(titleElem).toBeInTheDocument();
		expect(titleElem).toHaveTextContent(title);
	});

	it('previewonhover', async () => {
		const rendered = render(<Terms controller={controller} terms={mockTerms} previewOnHover />);
		const termOptions = rendered.container.querySelector('.ss__terms__option a');
		expect(termOptions).toBeInTheDocument();

		userEvent.hover(termOptions!);

		await waitFor(() => expect(mockTerms[0].preview).toHaveBeenCalled());
	});

	it('respects the limit', async () => {
		const limit = 3;
		const rendered = render(<Terms controller={controller} terms={mockTerms} limit={limit} />);
		const termOptions = rendered.container.querySelectorAll('.ss__terms__option');
		expect(termOptions).toHaveLength(limit);
	});

	it('Can set custom onClick', async () => {
		const onClick = jest.fn();
		const rendered = render(<Terms controller={controller} terms={mockTerms} onTermClick={onClick} />);
		const termOptions = rendered.container.querySelector('.ss__terms__option a');

		userEvent.click(termOptions!);

		expect(onClick).toHaveBeenCalled();
	});

	it('renders with classname', () => {
		const className = 'classy';

		const rendered = render(<Terms controller={controller} terms={mockTerms} className={className} />);
		const terms = rendered.container.querySelector('.ss__terms');

		expect(terms).toHaveClass(className);
	});

	it('disables styles', () => {
		const rendered = render(<Terms controller={controller} terms={mockTerms} disableStyles />);
		const terms = rendered.container.querySelector('.ss__terms');

		expect(terms?.classList).toHaveLength(1);
	});

	it('is themeable with ThemeProvider', () => {
		const globalTheme = {
			components: {
				terms: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Terms controller={controller} terms={mockTerms} />
			</ThemeProvider>
		);
		const terms = rendered.container.querySelector('.ss__terms');
		expect(terms).toBeInTheDocument();
		expect(terms?.classList.length).toBe(1);
	});

	it('is themeable with theme prop', () => {
		const propTheme = {
			components: {
				terms: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(<Terms controller={controller} terms={mockTerms} theme={propTheme} />);
		const terms = rendered.container.querySelector('.ss__terms');
		expect(terms).toBeInTheDocument();
		expect(terms?.classList.length).toBe(1);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const globalTheme = {
			components: {
				terms: {
					disableStyles: false,
				},
			},
		};
		const propTheme = {
			components: {
				terms: {
					disableStyles: true,
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Terms controller={controller} terms={mockTerms} theme={propTheme} />
			</ThemeProvider>
		);

		const terms = rendered.container.querySelector('.ss__terms');
		expect(terms).toBeInTheDocument();
		expect(terms?.classList.length).toBe(1);
	});
});

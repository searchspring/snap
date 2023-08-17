import { h } from 'preact';

import { v4 as uuidv4 } from 'uuid';
import { render } from '@testing-library/preact';
import { ThemeProvider } from '../../../providers';

import { Terms } from './Terms';
import { AutocompleteController, AutocompleteControllerConfig } from '@searchspring/snap-controller';
import { createAutocompleteController } from '@searchspring/snap-preact';
import { MockClient } from '@searchspring/snap-shared';
import userEvent from '@testing-library/user-event';

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

	let mockTerms = [
		{
			active: false,
			preview: () => {},
			value: 'dress',
			url: {
				href: 'www.dress.com',
			},
		},
		{
			active: false,
			preview: () => {},
			value: 'drss',
			url: {
				href: 'www.drss.com',
			},
		},
		{
			active: false,
			preview: () => {},
			value: 'dres',
			url: {
				href: 'www.dres.com',
			},
		},
		{
			active: false,
			preview: () => {},
			value: 'dss',
			url: {
				href: 'www.dss.com',
			},
		},
		{
			active: false,
			preview: () => {},
			value: 'ress',
			url: {
				href: 'www.ress.com',
			},
		},
	];

	let controller: AutocompleteController;
	beforeEach(async () => {
		controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();
	});

	it('renders', async () => {
		// @ts-ignore - typing on terms
		const rendered = render(<Terms controller={controller} terms={mockTerms} />);
		const terms = rendered.container.querySelector('.ss__terms');
		expect(terms).toBeInTheDocument();
	});

	it('renders with a title', async () => {
		const title = 'Suggestions';
		// @ts-ignore - typing on terms
		const rendered = render(<Terms controller={controller} terms={mockTerms} title={title} />);
		const terms = rendered.container.querySelector('.ss__terms');
		const titleElem = rendered.container.querySelector('.ss__terms__title');
		expect(terms).toBeInTheDocument();
		expect(titleElem).toBeInTheDocument();
		expect(titleElem).toHaveTextContent(title);
	});

	it('respects the limit', async () => {
		const limit = 3;
		// @ts-ignore - typing on terms
		const rendered = render(<Terms controller={controller} terms={mockTerms} limit={limit} />);
		const termOptions = rendered.container.querySelectorAll('.ss__terms__option');
		expect(termOptions).toHaveLength(limit);
	});

	it('Can set custom onClick', async () => {
		const onClick = jest.fn();
		// @ts-ignore - typing on terms
		const rendered = render(<Terms controller={controller} terms={mockTerms} onTermClick={onClick} />);
		const termOptions = rendered.container.querySelector('.ss__terms__option a');

		userEvent.click(termOptions!);

		expect(onClick).toHaveBeenCalled();
	});

	it('Can use emify', async () => {
		document.body.innerHTML = '<div>' + '  <input type="text" class="searchspring-ac">' + '<div id="target"></div></div>';
		mockClient.mockData.updateConfig({ autocomplete: 'default' });

		const input = document.querySelector('.searchspring-ac');
		expect(input).toBeInTheDocument();

		await controller.bind();

		userEvent.type(input!, 'dre');

		// @ts-ignore - typing on terms
		const rendered = render(<Terms controller={controller} terms={mockTerms} emIfy={true} />);
		const termOptions = rendered.container.querySelectorAll('.ss__terms__option a')[0];

		expect(termOptions?.innerHTML).toBe('dre<em>ss</em>');
	});

	it('renders with classname', () => {
		const className = 'classy';

		// @ts-ignore - typing on terms
		const rendered = render(<Terms controller={controller} terms={mockTerms} className={className} />);
		const terms = rendered.container.querySelector('.ss__terms');

		expect(terms).toHaveClass(className);
	});

	it('disables styles', () => {
		// @ts-ignore - typing on terms
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
				{/* @ts-ignore - typing on terms */}
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
		const rendered = render(
			// @ts-ignore - typing on terms
			<Terms controller={controller} terms={mockTerms} theme={propTheme} />
		);
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
				{/* @ts-ignore - typing on terms  */}
				<Terms controller={controller} terms={mockTerms} theme={propTheme} />
			</ThemeProvider>
		);

		const terms = rendered.container.querySelector('.ss__terms');
		expect(terms).toBeInTheDocument();
		expect(terms?.classList.length).toBe(1);
	});
});

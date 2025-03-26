import { h } from 'preact';

import { v4 as uuidv4 } from 'uuid';
import { render, waitFor } from '@testing-library/preact';
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

		expect(terms[0].classList).toContain('ss__terms--trending');
		expect(terms[1].classList).toContain('ss__terms--suggestions');
		expect(terms[2].classList).toContain('ss__terms--history');
	});

	it('can modify module order', async () => {
		const rendered = render(<TermsList controller={controller} modules={['Suggestions', 'History', 'Trending']} />);
		const termList = rendered.container.querySelector('.ss__terms-list');
		const terms = rendered.container.querySelectorAll('.ss__terms');
		expect(termList).toBeInTheDocument();

		expect(terms[0].classList).toContain('ss__terms--suggestions');
		expect(terms[1].classList).toContain('ss__terms--history');
		expect(terms[2].classList).toContain('ss__terms--trending');
	});

	it('can exclude history', async () => {
		const rendered = render(<TermsList controller={controller} modules={['Suggestions', 'Trending']} />);
		const termList = rendered.container.querySelector('.ss__terms-list');
		const terms = rendered.container.querySelectorAll('.ss__terms');
		const history = rendered.container.querySelector('.ss__terms--history');
		expect(termList).toBeInTheDocument();
		expect(terms[0].classList).toContain('ss__terms--suggestions');
		expect(terms[1].classList).toContain('ss__terms--trending');
		expect(history).not.toBeInTheDocument();
	});

	it('can exclude Suggestions', async () => {
		const rendered = render(<TermsList controller={controller} modules={['History', 'Trending']} />);
		const termList = rendered.container.querySelector('.ss__terms-list');
		const terms = rendered.container.querySelectorAll('.ss__terms');
		const suggested = rendered.container.querySelector('.ss__terms--suggestions');
		expect(termList).toBeInTheDocument();
		expect(terms[0].classList).toContain('ss__terms--history');
		expect(terms[1].classList).toContain('ss__terms--trending');
		expect(suggested).not.toBeInTheDocument();
	});

	it('can exclude Trending', async () => {
		const rendered = render(<TermsList controller={controller} modules={['Suggestions', 'History']} />);
		const termList = rendered.container.querySelector('.ss__terms-list');
		const terms = rendered.container.querySelectorAll('.ss__terms');
		const trending = rendered.container.querySelector('.ss__terms--trending');
		expect(termList).toBeInTheDocument();
		expect(terms[0].classList).toContain('ss__terms--suggestions');
		expect(terms[1].classList).toContain('ss__terms--history');
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

	// describe('termsList lang works', () => {
	// 	const selector = '.ss__termsList-list';

	// 	it('immediately available lang options', async () => {
	// 		const langOptions = ['term'];

	// 		//text attributes/values
	// 		const value = 'custom value';
	// 		const altText = 'custom alt';
	// 		const ariaLabel = 'custom label';
	// 		const ariaValueText = 'custom value text';
	// 		const title = 'custom title';

	// 		const valueMock = jest.fn(() => value);
	// 		const altMock = jest.fn(() => altText);
	// 		const labelMock = jest.fn(() => ariaLabel);
	// 		const valueTextMock = jest.fn(() => ariaValueText);
	// 		const titleMock = jest.fn(() => title);

	// 		const langObjs = [
	// 			{
	// 				value: value,
	// 				attributes: {
	// 					alt: altText,
	// 					'aria-label': ariaLabel,
	// 					'aria-valuetext': ariaValueText,
	// 					title: title,
	// 				},
	// 			},
	// 			{
	// 				value: valueMock,
	// 				attributes: {
	// 					alt: altMock,
	// 					'aria-label': labelMock,
	// 					'aria-valuetext': valueTextMock,
	// 					title: titleMock,
	// 				},
	// 			},
	// 			{
	// 				value: `<div>${value}</div>`,
	// 				attributes: {
	// 					alt: altText,
	// 					'aria-label': ariaLabel,
	// 					'aria-valuetext': ariaValueText,
	// 					title: title,
	// 				},
	// 			},
	// 		];

	// 		langOptions.forEach((option) => {
	// 			langObjs.forEach((langObj) => {
	// 				const lang = {
	// 					[`${option}`]: langObj,
	// 				};
	// 				// @ts-ignore
	// 				const rendered = render(<termsList lang={lang} controller={controller}  />);

	// 				const element = rendered.container.querySelector(selector);
	// 				expect(element).toBeInTheDocument();
	// 				const langElem = rendered.container.querySelector(`[ss-lang=${option}]`);

	// 				expect(langElem).toBeInTheDocument();
	// 				if (typeof langObj.value == 'function') {
	// 					expect(valueMock).toHaveBeenCalled();
	// 					controller.store.termsList.forEach((term, idx) => {
	// 						expect(valueMock).toHaveBeenCalledWith({
	// 							index: idx,
	// 							numberOftermsList: controller.store.termsList.length,
	// 							term: term,
	// 						});
	// 					});

	// 					expect(langElem?.innerHTML).toBe(value);
	// 				} else {
	// 					expect(langElem?.innerHTML).toBe(langObj.value);
	// 				}

	// 				expect(langElem).toHaveAttribute('alt', altText);
	// 				expect(langElem).toHaveAttribute('aria-label', ariaLabel);
	// 				expect(langElem).toHaveAttribute('aria-valuetext', ariaValueText);
	// 				expect(langElem).toHaveAttribute('title', title);

	// 				jest.restoreAllMocks();
	// 			});
	// 		});
	// 	});
	// });

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

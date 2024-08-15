import 'whatwg-fetch';
import { h } from 'preact';
import { v4 as uuidv4 } from 'uuid';
import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { ThemeProvider } from '../../../providers';
import { Autocomplete } from '../../Templates/Autocomplete/Autocomplete';
import { MockClient } from '@searchspring/snap-shared';
import { AutocompleteControllerConfig } from '@searchspring/snap-controller';
import { createAutocompleteController } from '../../../../../src/create';
import { waitFor } from '@testing-library/preact';

describe('Autocomplete Component', () => {
	jest.setTimeout(10000);
	const globals = { siteId: '8uyt2m' };
	let acConfig: AutocompleteControllerConfig;
	let controllerConfigId: string;
	let container: Element;
	const clientConfig = {
		globals: {
			siteId: '8uyt2m',
		},
	};

	const mockClient = new MockClient(globals, {});
	mockClient.mockData.updateConfig({ meta: 'ac.meta' });

	beforeEach(() => {
		document.body.innerHTML = '<div>' + '  <input type="text" class="searchspring-ac">' + '<div id="target"></div></div>';
		controllerConfigId = uuidv4().split('-').join('');

		acConfig = {
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
		container = document.getElementById('target')!;

		mockClient.mockData.updateConfig({ autocomplete: 'default' });
	});

	it('contains an input element on the page', () => {
		const input = document.querySelector('.searchspring-ac');
		expect(input).toBeInTheDocument();
	});

	it('does not render if input have not been focused', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
		};
		const rendered = render(<Autocomplete {...args} />);

		const autocomplete = rendered.container.querySelector('.ss__autocomplete');
		expect(autocomplete).not.toBeInTheDocument();
	});

	it('renders after input has been focused', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
		};

		const input = document.querySelector('.searchspring-ac');
		(input as HTMLInputElement).focus();

		const rendered = render(<Autocomplete {...args} />, { container });

		await waitFor(() => {
			const autocomplete = rendered.container.querySelector('.ss__autocomplete');
			expect(autocomplete).toBeInTheDocument();
		});
	});

	it('renders results if you type, uses breakpoints to set num products rendered. ', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const breakpoints = {
			768: {
				columns: 3,
				rows: 3,
			},
		};

		const args = {
			controller,
			input: controller.config.selector,
			breakpoints,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		const rendered = render(<Autocomplete {...args} />, { container });

		await waitFor(() => {
			const results = rendered.container.querySelectorAll('.ss__autocomplete__content__results .ss__result');
			expect(results[0]).toBeInTheDocument();
			expect(results.length).toEqual(9);
		});
	});

	it('terms are emified as exected', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';
		const rendered = render(<Autocomplete {...args} />, { container });

		await waitFor(() => {
			let termLinks = rendered.container.querySelectorAll('.ss__autocomplete .ss__autocomplete__terms__option a');

			expect(termLinks[0]).toBeInTheDocument();
			expect(termLinks[0].innerHTML).toEqual('dress');

			expect(termLinks[1]).toBeInTheDocument();
			expect(termLinks[1].innerHTML).toEqual('<em>red </em>dress');
		});
	});

	it('can hover over terms, & facets', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		const rendered = render(<Autocomplete {...args} />, { container });
		let termLinks: any;
		let firstResult: any;
		let terms: any;
		let facetOptions: any;
		let newFirstResult: any;

		await waitFor(() => {
			//first test the terms.
			termLinks = rendered.container.querySelectorAll('.ss__autocomplete .ss__autocomplete__terms__option a');
			terms = rendered.container.querySelectorAll('.ss__autocomplete .ss__autocomplete__terms__option');
			const results = rendered.container.querySelectorAll('.ss__autocomplete__content__results .ss__result');

			//there should be results
			expect(results[0]).toBeInTheDocument();
			//we need to save this for later
			firstResult = results[0].innerHTML;
			//there should be terms
			expect(termLinks[0]).toBeInTheDocument();
			//first term should be auto selected
			expect(terms[0]).toHaveClass('ss__autocomplete__terms__option--active');
		});

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.hover.term' });

		//now lets hover over the next term
		userEvent.hover(termLinks![1]);

		await waitFor(() => {
			//now lets check for the new results
			const newResults = rendered.container.querySelectorAll('.ss__autocomplete__content__results .ss__result');
			//there should be new results available
			expect(newResults[0]).toBeInTheDocument();
			// we will need to save this for later
			newFirstResult = newResults[0].innerHTML;
			//new result should be different from the previous result
			expect(newFirstResult).not.toEqual(firstResult);

			//first term should no longer be active, and hover term should be.
			expect(terms[1]).toHaveClass('ss__autocomplete__terms__option--active');
			expect(terms[0]).not.toHaveClass('ss__autocomplete__terms__option--active');

			//now lets test the facets
			facetOptions = rendered.container.querySelectorAll('.ss__facet-list-options__option');

			//there should be facets
			expect(facetOptions[0]).toBeInTheDocument();
			//shouldnt be active
			expect(facetOptions[0]).not.toHaveClass('ss__facet-list-options__option--filtered');
		});

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.hover.facet' });

		//now lets hover over one
		userEvent.hover(facetOptions![0]);

		await waitFor(() => {
			//check for the new results
			const newNewResults = rendered.container.querySelectorAll('.ss__autocomplete__content__results .ss__result');
			expect(newNewResults[0]).toBeInTheDocument();
			//new results should again be different from previous results
			expect(newNewResults[0].innerHTML).not.toEqual(newFirstResult);

			//hover facet should have now be active.
			facetOptions = rendered.container.querySelectorAll('.ss__facet-list-options__option');
			expect(facetOptions![0]).toHaveClass('ss__facet-list-options__option--filtered');
		});
	});

	it('can use hide props to hide/show hideTerms, hideFacets, hideContent, hideLink & hideHistory', async () => {
		const mockStorage: {
			[key: string]: string;
		} = {};
		global.Storage.prototype.setItem = jest.fn((key, value) => {
			mockStorage[key] = value;
		});
		global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);
		const historyData = ['dress', 'sleep', 'shirt', 'sandal', 'shoes'];
		global.localStorage.setItem(`ss-history`, JSON.stringify({ history: JSON.stringify(historyData) }));

		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
			hideTerms: true,
			hideFacets: true,
			hideTrending: true,
			hideContent: true,
			hideLink: true,
			hideHistory: true,
			retainHistory: true,
			retainTrending: true,
		};

		const otherArgs = {
			controller,
			input: controller.config.selector,
			hideTerms: false,
			hideTrending: false,
			hideFacets: false,
			hideContent: false,
			hideLink: false,
			hideHistory: false,
			retainHistory: true,
			retainTrending: true,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		const renderedWithout = render(<Autocomplete {...args} />, { container });

		await waitFor(() => {
			const terms = renderedWithout.container.querySelector('.ss__autocomplete__terms');
			expect(terms).not.toBeInTheDocument();

			const facets = renderedWithout.container.querySelector('.ss__autocomplete__facets');
			expect(facets).not.toBeInTheDocument();

			const content = renderedWithout.container.querySelector('.ss__autocomplete__content');
			expect(content).not.toBeInTheDocument();

			const link = renderedWithout.container.querySelector('.ss__autocomplete__content__info');
			expect(link).not.toBeInTheDocument();

			const history = renderedWithout.container.querySelector('.ss__autocomplete__terms__history .ss__autocomplete__terms__options');
			expect(history).not.toBeInTheDocument();

			const trending = renderedWithout.container.querySelector('.ss__autocomplete__terms__trending .ss__autocomplete__terms__options');
			expect(trending).not.toBeInTheDocument();
		});

		const renderedWith = render(<Autocomplete {...otherArgs} />, { container });

		await waitFor(() => {
			const terms2 = renderedWith.container.querySelector('.ss__autocomplete__terms');
			expect(terms2).toBeInTheDocument();

			const facets2 = renderedWith.container.querySelector('.ss__autocomplete__facets');
			expect(facets2).toBeInTheDocument();

			const content2 = renderedWith.container.querySelector('.ss__autocomplete__content');
			expect(content2).toBeInTheDocument();

			const link2 = renderedWith.container.querySelector('.ss__autocomplete__content__info');
			expect(link2).toBeInTheDocument();

			const history2 = renderedWith.container.querySelector('.ss__autocomplete__terms__history .ss__autocomplete__terms__options');
			expect(history2).toBeInTheDocument();

			const trending2 = renderedWithout.container.querySelector('.ss__autocomplete__terms__trending .ss__autocomplete__terms__options');
			expect(trending2).toBeInTheDocument();
		});
	});

	it('can hideBanners', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
			hideBanners: true,
		};

		const otherArgs = {
			controller,
			input: controller.config.selector,
			hideBanners: false,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		//note this test assumes there is a banner available on that term.. which at this time there is
		//todo use a mock for this
		input.value = 'dress';
		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.banners' });

		const renderedWithoutBanners = render(<Autocomplete {...args} />, { container });
		await waitFor(() => {
			const banners = renderedWithoutBanners.container.querySelector('.ss__banner');
			expect(banners).not.toBeInTheDocument();
		});

		const renderedWithBanners = render(<Autocomplete {...otherArgs} />, { container });

		await waitFor(() => {
			const banners2 = renderedWithBanners.container.querySelector('.ss__banner');
			expect(banners2).toBeInTheDocument();
		});
	});

	it('can set custom titles, such as termsTitle, facetsTitle, contentTitle, & historyTitle', async () => {
		const mockStorage: {
			[key: string]: string;
		} = {};
		global.Storage.prototype.setItem = jest.fn((key, value) => {
			mockStorage[key] = value;
		});
		global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);
		const historyData = ['dress', 'sleep', 'shirt', 'sandal', 'shoes'];
		global.localStorage.setItem(`ss-history`, JSON.stringify({ history: JSON.stringify(historyData) }));

		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
			termsTitle: 'custom termsTitle',
			trendingTitle: 'custom TrendingTitle',
			facetsTitle: 'custom facetsTitle',
			contentTitle: 'custom contentTitle',
			historyTitle: 'custom histoyTitle',
			retainHistory: true,
			retainTrending: true,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		const rendered = render(<Autocomplete {...args} />, { container });

		await waitFor(() => {
			const termTitle = rendered.container.querySelector('.ss__autocomplete__title');
			expect(termTitle).toHaveTextContent(args.termsTitle);

			const facetsTitle = rendered.container.querySelector('.ss__autocomplete__title--facets');
			expect(facetsTitle).toHaveTextContent(args.facetsTitle);

			const contentTitle = rendered.container.querySelector('.ss__autocomplete__title--content');
			expect(contentTitle).toHaveTextContent(args.contentTitle);

			const historyTitle = rendered.container.querySelector('.ss__autocomplete__title--history');
			expect(historyTitle).toHaveTextContent(args.historyTitle);

			const trendingTitle = rendered.container.querySelector('.ss__autocomplete__title--trending');
			expect(trendingTitle).toHaveTextContent(args.trendingTitle);
		});
	});

	it('can use retainhistory && retaintrending false', async () => {
		const mockStorage: {
			[key: string]: string;
		} = {};
		global.Storage.prototype.setItem = jest.fn((key, value) => {
			mockStorage[key] = value;
		});
		global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);
		const historyData = ['dress', 'sleep', 'shirt', 'sandal', 'shoes'];
		global.localStorage.setItem(`ss-history`, JSON.stringify({ history: JSON.stringify(historyData) }));

		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;

		const args = {
			controller,
			retainHistory: false,
			retainTrending: false,
			historyTitle: 'custom histoy Title',
			trendingTitle: 'custom trending Title',
		};

		input.focus();

		const rendered = render(<Autocomplete input={input} {...args} />, { container });

		await waitFor(() => {
			const historyTitle = rendered.container.querySelector('.ss__autocomplete__title--history');
			expect(historyTitle).toHaveTextContent(args.historyTitle);

			const trendingTitle = rendered.container.querySelector('.ss__autocomplete__title--trending');
			expect(trendingTitle).toHaveTextContent(args.trendingTitle);
		});

		input.focus();
		userEvent.keyboard('dress');

		await waitFor(() => {
			const historyTitle = rendered.container.querySelector('.ss__autocomplete__title--history');
			expect(historyTitle).not.toBeInTheDocument();

			const trendingTitle = rendered.container.querySelector('.ss__autocomplete__title--trending');
			expect(trendingTitle).not.toBeInTheDocument();
		});

		const args2 = {
			controller,
			input: controller.config.selector,
			retainHistory: true,
			retainTrending: true,
			historyTitle: 'custom histoy Title',
			trendingTitle: 'custom trending Title',
		};

		input.value = '';
		input.focus();
		let rendered2 = render(<Autocomplete {...args2} />, { container });

		await waitFor(() => {
			const historyTitle = rendered2.container.querySelector('.ss__autocomplete__title--history');
			expect(historyTitle).toHaveTextContent(args.historyTitle);

			const trendingTitle = rendered2.container.querySelector('.ss__autocomplete__title--trending');
			expect(trendingTitle).toHaveTextContent(args.trendingTitle);
		});

		input.focus();
		userEvent.keyboard('dress');

		rendered2 = render(<Autocomplete {...args2} />, { container });
		await waitFor(() => {
			const historyTitle = rendered2.container.querySelector('.ss__autocomplete__title--history');
			expect(historyTitle).toHaveTextContent(args.historyTitle);

			const trendingTitle = rendered2.container.querySelector('.ss__autocomplete__title--trending');
			expect(trendingTitle).toHaveTextContent(args.trendingTitle);
		});
	});

	it('can set a custom trending title', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
			trendingTitle: 'Lorem Ipsum',
		};

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.query.blank' });

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();

		const rendered = render(<Autocomplete {...args} />, { container });

		await waitFor(() => {
			const trendingTitle = rendered.container.querySelector('.ss__autocomplete__title--trending');
			expect(trendingTitle).toHaveTextContent(args.trendingTitle);
		});
	});

	it('can se custom slots, such as termsSlot, facetsSlot, resultsSlot, linkSlot', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
			termsSlot: <div>custom termsSlot</div>,
			facetsSlot: <div>custom facetsSlot</div>,
			resultsSlot: <div>custom resultsSlot</div>,
			linkSlot: <div id="findMe">custom linkSlot</div>,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		const rendered = render(<Autocomplete {...args} />, { container });

		await waitFor(() => {
			const termsSlot = rendered.container.querySelector('.ss__autocomplete__terms');
			expect(termsSlot).toHaveTextContent('custom termsSlot');

			const facetSlot = rendered.container.querySelector('.ss__autocomplete__facets');
			expect(facetSlot).toHaveTextContent('custom facetsSlot');

			const resultsSlot = rendered.container.querySelector('.ss__autocomplete__content__results');
			const defaultTitle = rendered.container.querySelector('.ss__autocomplete__title--content');
			expect(defaultTitle).not.toBeInTheDocument();
			expect(resultsSlot).toHaveTextContent('custom resultsSlot');

			const defaultLink = rendered.container.querySelector('.ss__autocomplete__content__info');
			const linkSlot = rendered.container.querySelector('.ss__autocomplete__content #findMe');

			expect(defaultLink).not.toBeInTheDocument();
			expect(linkSlot).toHaveTextContent('custom linkSlot');
		});
	});

	//cant render both content slot and results slot at the same time.
	it('can set a custom content slot', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
			contentSlot: <div>Lorem Ipsum</div>,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		const rendered = render(<Autocomplete {...args} />, { container });

		await waitFor(() => {
			const contentSlot = rendered.container.querySelector('.ss__autocomplete__content');
			expect(contentSlot).toHaveTextContent('Lorem Ipsum');
		});
	});

	// needs own term
	it('can set a custom noResults slot', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
			noResultsSlot: <div>Lorem Ipsum</div>,
		};

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.noresults' });

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.value = 'efjii4iieiiedid';

		input.focus();

		const rendered = render(<Autocomplete {...args} />, { container });

		await waitFor(() => {
			const noResultsSlot = rendered.container.querySelector('.ss__autocomplete__content__no-results');
			expect(noResultsSlot).toHaveTextContent('Lorem Ipsum');
		});
	});

	it('auto selects first trending term', async () => {
		const trendingACConfig = {
			id: controllerConfigId,
			selector: 'input.searchspring-ac',
			settings: {
				trending: {
					limit: 5,
					showResults: true,
				},
			},
		};

		const controller = createAutocompleteController({ client: clientConfig, controller: trendingACConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
		};

		const input = document.querySelector('.searchspring-ac');
		(input as HTMLInputElement).focus();

		const rendered = render(<Autocomplete {...args} />, { container });
		await waitFor(() => {
			const autocomplete = rendered.container.querySelector('.ss__autocomplete');
			expect(autocomplete).toBeInTheDocument();

			const terms = rendered.container.querySelectorAll('.ss__autocomplete__terms__option');
			expect(terms.length).toBe(controller.store.trending.length);

			expect(terms[0]).toHaveClass('ss__autocomplete__terms__option--active');

			expect(controller.store.trending[0].active).toBeTruthy();

			const results = rendered.container.querySelectorAll('.ss__result');
			expect(results[0]).toBeInTheDocument();
		});
	});

	it('can set a custom css width', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
			width: '200px',
		};
		//lets test both px and percent to be safe, both should be allowed.
		const args2 = {
			controller,
			input: controller.config.selector,
			width: '100%',
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		const rendered = render(<Autocomplete {...args} />, { container });

		await waitFor(() => {
			const ac = rendered.container.querySelector('.ss__autocomplete')!;
			const styles = getComputedStyle(ac);
			expect(styles['width']).toBe(args.width);
		});

		const rendered2 = render(<Autocomplete {...args2} />, { container });
		await waitFor(() => {
			const ac2 = rendered2.container.querySelector('.ss__autocomplete')!;
			const styles2 = getComputedStyle(ac2);
			expect(styles2['width']).toBe(args2.width);
		});
	});

	it('can use breakpoints', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const customBreakpoints = {
			0: {
				hideFacets: true,
			},
			700: {
				hideFacets: false,
			},
		};

		const args = {
			controller,
			input: controller.config.selector,
			breakpoints: customBreakpoints,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		const rendered = render(<Autocomplete {...args} />, { container });
		let acFacets: any;
		await waitFor(() => {
			acFacets = rendered.container.querySelector('.ss__autocomplete .ss__autocomplete__facets');
			expect(acFacets).toBeInTheDocument();
		});

		// Change the viewport to 500px.
		global.innerWidth = 500;
		// Trigger the window resize event.
		global.dispatchEvent(new Event('resize'));

		await waitFor(() => {
			expect(acFacets).not.toBeInTheDocument();
		});

		// Change the viewport back to desktop.
		global.innerWidth = 1500;
	});

	it('Autocomplete lang works', async () => {
		const mockStorage: {
			[key: string]: string;
		} = {};
		global.Storage.prototype.setItem = jest.fn((key, value) => {
			mockStorage[key] = value;
		});
		global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);
		const historyData = ['dress', 'sleep', 'shirt', 'sandal', 'shoes'];
		global.localStorage.setItem(`ss-history`, JSON.stringify({ history: JSON.stringify(historyData) }));

		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
			retainTrending: true,
			retainHistory: true,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		await waitFor(() => {
			expect(controller.store.results.length).toBeGreaterThan(0);
		});

		const langOptions = [
			'termsTitle',
			'trendingTitle',
			'historyTitle',
			'facetsTitle',
			'contentTitle',
			'closeButton',
			'trendingTerm',
			'suggestionsTerm',
			'historyTerm',
			'contentInfo',
		];

		//text attributes/values
		const value = 'custom value';
		const altText = 'custom alt';
		const ariaLabel = 'custom label';
		const ariaValueText = 'custom value text';
		const title = 'custom title';

		const valueMock = jest.fn(() => value);
		const altMock = jest.fn(() => altText);
		const labelMock = jest.fn(() => ariaLabel);
		const valueTextMock = jest.fn(() => ariaValueText);
		const titleMock = jest.fn(() => title);

		const langObjs = [
			{
				value: value,
				attributes: {
					alt: altText,
					'aria-label': ariaLabel,
					'aria-valuetext': ariaValueText,
					title: title,
				},
			},
			{
				value: valueMock,
				attributes: {
					alt: altMock,
					'aria-label': labelMock,
					'aria-valuetext': valueTextMock,
					title: titleMock,
				},
			},
			{
				value: `<div>${value}</div>`,
				attributes: {
					alt: altText,
					'aria-label': ariaLabel,
					'aria-valuetext': ariaValueText,
					title: title,
				},
			},
		];

		langOptions.forEach(async (option) => {
			langObjs.forEach(async (langObj) => {
				const lang = {
					[`${option}`]: langObj,
				};

				let valueSatisfied = false;
				let altSatisfied = false;
				let labelSatisfied = false;
				let valueTextSatisfied = false;
				let titleSatisfied = false;

				const rendered = render(<Autocomplete lang={lang} {...args} />, { container });

				const autocomplete = rendered.container.querySelector('.ss__autocomplete');
				expect(autocomplete).toBeInTheDocument();

				const langElems = rendered.container.querySelectorAll(`[ss-lang=${option}]`);
				console.log(option);

				expect(langElems.length).toBeGreaterThan(0);
				langElems.forEach((elem) => {
					if (typeof langObj.value == 'function') {
						if (option == 'trendingTerm') {
							controller.store.trending.forEach((term, idx) => {
								expect(valueMock).toHaveBeenCalledWith({
									controller: controller,
									term: term,
									index: idx,
								});
							});
						} else if ('suggestionsTerm') {
							controller.store.terms.forEach((term, idx) => {
								expect(valueMock).toHaveBeenCalledWith({
									controller: controller,
									term: term,
									index: idx,
								});
							});
						} else if ('historyTerm') {
							controller.store.history.forEach((term, idx) => {
								expect(valueMock).toHaveBeenCalledWith({
									controller: controller,
									term: term,
									index: idx,
								});
							});
						} else {
							expect(valueMock).toHaveBeenCalledWith({
								controller: controller,
							});
						}

						if (elem?.innerHTML == value) {
							valueSatisfied = true;
						}
					} else {
						if (elem?.innerHTML == langObj.value) {
							valueSatisfied = true;
						}
					}
					if (elem.getAttribute('alt') == altText) {
						altSatisfied = true;
					}
					if (elem.getAttribute('aria-label') == ariaLabel) {
						labelSatisfied = true;
					}
					if (elem.getAttribute('aria-valuetext') == ariaValueText) {
						valueTextSatisfied = true;
					}
					if (elem.getAttribute('title') == title) {
						titleSatisfied = true;
					}
				});

				expect(valueSatisfied).toBeTruthy();
				expect(altSatisfied).toBeTruthy();
				expect(labelSatisfied).toBeTruthy();
				expect(valueTextSatisfied).toBeTruthy();
				expect(titleSatisfied).toBeTruthy();

				jest.restoreAllMocks();
			});
		});
	});

	it('noresultstext lang works', async () => {
		const value = 'custom value';
		const altText = 'custom alt';
		const ariaLabel = 'custom label';
		const ariaValueText = 'custom value text';
		const title = 'custom title';

		const valueMock = jest.fn(() => value);
		const altMock = jest.fn(() => altText);
		const labelMock = jest.fn(() => ariaLabel);
		const valueTextMock = jest.fn(() => ariaValueText);
		const titleMock = jest.fn(() => title);

		const langObjs = [
			{
				value: value,
				attributes: {
					alt: altText,
					'aria-label': ariaLabel,
					'aria-valuetext': ariaValueText,
					title: title,
				},
			},
			{
				value: valueMock,
				attributes: {
					alt: altMock,
					'aria-label': labelMock,
					'aria-valuetext': valueTextMock,
					title: titleMock,
				},
			},
			{
				value: `<div>${value}</div>`,
				attributes: {
					alt: altText,
					'aria-label': ariaLabel,
					'aria-valuetext': ariaValueText,
					title: title,
				},
			},
		];

		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
		};

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.noresults' });

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.value = 'efjii4iieiiedid';

		input.focus();

		await waitFor(() => {
			expect(controller.store.search.query?.string).toBe('efjii4iieiiedid');

			langObjs.forEach(async (langObj) => {
				const lang = {
					[`noResultsText`]: langObj,
				};

				let valueSatisfied = false;
				let altSatisfied = false;
				let labelSatisfied = false;
				let valueTextSatisfied = false;
				let titleSatisfied = false;

				const rendered = render(<Autocomplete lang={lang} {...args} />, { container });

				const autocomplete = rendered.container.querySelector('.ss__autocomplete');
				expect(autocomplete).toBeInTheDocument();

				const langElems = rendered.container.querySelectorAll(`[ss-lang=noResultsText]`);
				expect(langElems.length).toBeGreaterThan(0);

				langElems.forEach((elem) => {
					if (typeof langObj.value == 'function') {
						expect(valueMock).toHaveBeenCalledWith({
							controller: controller,
						});
						if (elem?.innerHTML == value) {
							valueSatisfied = true;
						}
					} else {
						if (elem?.innerHTML == langObj.value) {
							valueSatisfied = true;
						}
					}
					if (elem.getAttribute('alt') == altText) {
						altSatisfied = true;
					}
					if (elem.getAttribute('aria-label') == ariaLabel) {
						labelSatisfied = true;
					}
					if (elem.getAttribute('aria-valuetext') == ariaValueText) {
						valueTextSatisfied = true;
					}
					if (elem.getAttribute('title') == title) {
						titleSatisfied = true;
					}
				});

				expect(valueSatisfied).toBeTruthy();
				expect(altSatisfied).toBeTruthy();
				expect(labelSatisfied).toBeTruthy();
				expect(valueTextSatisfied).toBeTruthy();
				expect(titleSatisfied).toBeTruthy();

				jest.restoreAllMocks();
			});
		});
	});

	describe('AutoComplete theming works', () => {
		it('is themeable with ThemeProvider', async () => {
			const globalTheme = {
				components: {
					autocomplete: {
						trendingTitle: 'Lorem Ipsum',
					},
				},
			};

			const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
			await controller.bind();

			const args = {
				controller,
				input: controller.config.selector,
			};

			const input = document.querySelector('.searchspring-ac');
			(input as HTMLInputElement).focus();

			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Autocomplete {...args} />
				</ThemeProvider>,
				{ container }
			);
			await waitFor(() => {
				const element = rendered.container.querySelector('.ss__autocomplete__title h5');
				expect(element).toBeInTheDocument();
				expect(element).toHaveTextContent(globalTheme.components.autocomplete.trendingTitle);
			});
		});

		it('is themeable with theme prop', async () => {
			const ContentSlot = () => {
				return <div className="content-slot">the contents...</div>;
			};

			const propTheme = {
				components: {
					autocomplete: {
						trendingTitle: 'Lorem Ipsum',
						contentSlot: [<ContentSlot />],
					},
				},
			};

			const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
			await controller.bind();

			const args = {
				controller,
				input: controller.config.selector,
			};

			const input = document.querySelector('.searchspring-ac');
			(input as HTMLInputElement).focus();

			const rendered = render(<Autocomplete {...args} theme={propTheme} />, { container });
			await waitFor(() => {
				const trendingTitleElem = rendered.container.querySelector('.ss__autocomplete__title h5');
				expect(trendingTitleElem).toBeInTheDocument();
				expect(trendingTitleElem).toHaveTextContent(propTheme.components.autocomplete.trendingTitle);

				const contentElems = rendered.container.querySelectorAll('.content-slot');
				expect(contentElems).toHaveLength(1);
				const contentElem = contentElems[0];
				expect(contentElem).toBeInTheDocument();
				expect(contentElem).toHaveTextContent('the contents...');
			});
		});

		it('is theme prop overrides ThemeProvider', async () => {
			const ContentSlot = () => {
				return <div className="content-slot">contents...</div>;
			};

			const GlobalContentSlot = () => {
				return <div className="content-slot">global contents...</div>;
			};

			const globalTheme = {
				components: {
					autocomplete: {
						trendingTitle: 'shouldnt find this',
						contentSlot: [<GlobalContentSlot />],
					},
				},
			};
			const propTheme = {
				components: {
					autocomplete: {
						trendingTitle: 'should find this',
						contentSlot: [<ContentSlot />],
					},
				},
			};

			const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
			await controller.bind();

			const args = {
				controller,
				input: controller.config.selector,
			};

			const input = document.querySelector('.searchspring-ac');
			(input as HTMLInputElement).focus();

			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Autocomplete {...args} theme={propTheme} />
				</ThemeProvider>,
				{ container }
			);

			await waitFor(() => {
				const element = rendered.container.querySelector('.ss__autocomplete__title h5');
				expect(element).toBeInTheDocument();
				expect(element).toHaveTextContent(propTheme.components.autocomplete.trendingTitle);
				expect(element).not.toHaveTextContent(globalTheme.components.autocomplete.trendingTitle);

				const contentElems = rendered.container.querySelectorAll('.content-slot');
				expect(contentElems).toHaveLength(1);
				const contentElem = contentElems[0];
				expect(contentElem).toBeInTheDocument();
				expect(contentElem).toHaveTextContent('contents...');
			});
		});

		it('breakpoints override theme prop', async () => {
			// Change the viewport to 1200px.
			global.innerWidth = 1200;

			// Trigger the window resize event.
			global.dispatchEvent(new Event('resize'));

			const TermsSlot = () => {
				return <div className="terms-slot">terms...</div>;
			};

			const DetailSlot = () => {
				return <div className="detail-slot">details...</div>;
			};

			const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
			await controller.bind();

			const theme = {
				components: {
					autocomplete: {
						termsSlot: [<TermsSlot />],
					},
					facet: {
						limit: 9,
					},
					result: {
						detailSlot: [<DetailSlot />],
					},
				},
			};

			const customBreakpoints = {
				0: {
					columns: 3,
					rows: 1,
				},
				700: {
					columns: 3,
					rows: 1,
					termsSlot: [<TermsSlot />],
					theme: {
						components: {
							autocomplete: {
								termsSlot: [<TermsSlot />],
							},
							facet: {
								limit: 4,
							},
							result: {
								detailSlot: [<DetailSlot />],
							},
						},
					},
				},
			};

			const args = {
				controller,
				input: controller.config.selector,
				breakpoints: customBreakpoints,
				theme: theme,
			};

			const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
			input.focus();
			input.value = 'dress';

			const rendered = render(<Autocomplete {...args} />, { container });
			let acFacet: any;
			let termsSlots: any;
			let detailSlots: any;
			let options: any;

			await waitFor(() => {
				acFacet = rendered.container.querySelector('.ss__autocomplete .ss__facet');
				options = acFacet.querySelectorAll('.ss__facet__options a');
				termsSlots = rendered.container.querySelectorAll('.terms-slot');
				detailSlots = rendered.container.querySelectorAll('.detail-slot');

				expect(options).toHaveLength(customBreakpoints[700].theme.components.facet.limit);
				expect(termsSlots).toHaveLength(1);
				expect(detailSlots).toHaveLength(3);
			});

			// Change the viewport to 500px.
			global.innerWidth = 500;

			// Trigger the window resize event.
			global.dispatchEvent(new Event('resize'));

			await waitFor(() => {
				acFacet = rendered.container.querySelector('.ss__autocomplete .ss__facet');
				options = acFacet.querySelectorAll('.ss__facet__options a');
				termsSlots = rendered.container.querySelectorAll('.terms-slot');
				detailSlots = rendered.container.querySelectorAll('.detail-slot');

				expect(options?.length).toEqual(theme.components.facet.limit);
				expect(termsSlots).toHaveLength(1);
				expect(detailSlots).toHaveLength(3);
			});
		});
	});
});

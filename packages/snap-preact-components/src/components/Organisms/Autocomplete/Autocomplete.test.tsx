import 'whatwg-fetch';
import { h } from 'preact';
import { v4 as uuidv4 } from 'uuid';
import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { ThemeProvider } from '../../../providers';
import { Autocomplete } from '../../Organisms/Autocomplete/Autocomplete';
import { MockClient } from '@searchspring/snap-shared';
import { INPUT_DELAY, AutocompleteControllerConfig } from '@searchspring/snap-controller';
import { createAutocompleteController } from '@searchspring/snap-preact';

describe('Autocomplete Component', () => {
	const globals = { siteId: '8uyt2m' };

	let acConfig: AutocompleteControllerConfig;
	let controllerConfigId: string;
	let container: Element;
	const config = {
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
		const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
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
		const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
		};

		const input = document.querySelector('.searchspring-ac');
		(input as HTMLInputElement).focus();

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY));

		const rendered = render(<Autocomplete {...args} />, { container });

		const autocomplete = rendered.container.querySelector('.ss__autocomplete');
		expect(autocomplete).toBeInTheDocument();
	});

	it('renders results if you type, uses breakpoints to set num products rendered. ', async () => {
		const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
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

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

		let rendered = render(<Autocomplete {...args} />, { container });

		let results = rendered.container.querySelectorAll('.ss__autocomplete__content__results .ss__result');
		expect(results[0]).toBeInTheDocument();
		expect(results.length).toEqual(9);
	});

	it('can hover over terms, & facets', async () => {
		const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY + 10));

		let rendered = render(<Autocomplete {...args} />, { container });

		//first test the terms.
		let termLinks = rendered.container.querySelectorAll('.ss__autocomplete .ss__autocomplete__terms__option a');
		let terms = rendered.container.querySelectorAll('.ss__autocomplete .ss__autocomplete__terms__option');
		const results = rendered.container.querySelectorAll('.ss__autocomplete__content__results .ss__result');

		//there should be results
		expect(results[0]).toBeInTheDocument();
		//we need to save this for later
		const firstResult = results[0].innerHTML;
		//there should be terms
		expect(termLinks[0]).toBeInTheDocument();
		//first term should be auto selected
		expect(terms[0]).toHaveClass('ss__autocomplete__terms__option--active');

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.hover.term' });

		//now lets hover over the next term
		userEvent.hover(termLinks[1]);

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY * 2));

		//now lets check for the new results
		let newResults = rendered.container.querySelectorAll('.ss__autocomplete__content__results .ss__result');
		//there should be new results available
		expect(newResults[0]).toBeInTheDocument();
		// we will need to save this for later
		const newFirstResult = newResults[0].innerHTML;
		//new result should be different from the previous result
		expect(newFirstResult).not.toEqual(firstResult);

		//first term should no longer be active, and hover term should be.
		expect(terms[1]).toHaveClass('ss__autocomplete__terms__option--active');
		expect(terms[0]).not.toHaveClass('ss__autocomplete__terms__option--active');

		//now lets test the facets
		const facetOptions = rendered.container.querySelectorAll('.ss__facet-list-options__option');

		//there should be facets
		expect(facetOptions[0]).toBeInTheDocument();
		//shouldnt be active
		expect(facetOptions[0]).not.toHaveClass('ss__facet-list-options__option--filtered');

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.hover.facet' });

		//now lets hover over one
		userEvent.hover(facetOptions[0]);

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY * 2));

		//check for the new results
		let newNewResults = rendered.container.querySelectorAll('.ss__autocomplete__content__results .ss__result');
		expect(newNewResults[0]).toBeInTheDocument();
		//new results should again be different from previous results
		expect(newNewResults[0].innerHTML).not.toEqual(newFirstResult);

		//hover facet should have now be active.
		expect(facetOptions[0]).toHaveClass('ss__facet-list-options__option--filtered');
	});

	it('can use hide props to hide/show hideTerms, hideFacets, hideContent, hideLink', async () => {
		const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
			hideTerms: true,
			hideFacets: true,
			hideContent: true,
			hideLink: true,
		};

		const otherArgs = {
			controller,
			input: controller.config.selector,
			hideTerms: false,
			hideFacets: false,
			hideContent: false,
			hideLink: false,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

		let renderedWithout = render(<Autocomplete {...args} />, { container });

		let terms = renderedWithout.container.querySelector('.ss__autocomplete__terms');
		expect(terms).not.toBeInTheDocument();

		let facets = renderedWithout.container.querySelector('.ss__autocomplete__facets');
		expect(facets).not.toBeInTheDocument();

		let content = renderedWithout.container.querySelector('.ss__autocomplete__content');
		expect(content).not.toBeInTheDocument();

		let link = renderedWithout.container.querySelector('.ss__autocomplete__content__info');
		expect(link).not.toBeInTheDocument();

		let renderedWith = render(<Autocomplete {...otherArgs} />, { container });

		let terms2 = renderedWith.container.querySelector('.ss__autocomplete__terms');
		expect(terms2).toBeInTheDocument();

		let facets2 = renderedWith.container.querySelector('.ss__autocomplete__facets');
		expect(facets2).toBeInTheDocument();

		let content2 = renderedWith.container.querySelector('.ss__autocomplete__content');
		expect(content2).toBeInTheDocument();

		let link2 = renderedWith.container.querySelector('.ss__autocomplete__content__info');
		expect(link2).toBeInTheDocument();
	});

	it('can hideBanners', async () => {
		const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
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

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

		let renderedWithoutBanners = render(<Autocomplete {...args} />, { container });
		let banners = renderedWithoutBanners.container.querySelector('.ss__banner');
		expect(banners).not.toBeInTheDocument();

		let renderedWithBanners = render(<Autocomplete {...otherArgs} />, { container });
		let banners2 = renderedWithBanners.container.querySelector('.ss__banner');
		expect(banners2).toBeInTheDocument();
	});

	it('can set custom titles, such as termsTitle, facetsTitle, contentTitle', async () => {
		const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
			termsTitle: 'custom termsTitle',
			facetsTitle: 'custom facetsTitle',
			contentTitle: 'custom contentTitle',
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

		let rendered = render(<Autocomplete {...args} />, { container });

		let termTitle = rendered.container.querySelector('.ss__autocomplete__title');
		expect(termTitle).toHaveTextContent(args.termsTitle);

		let facetsTitle = rendered.container.querySelector('.ss__autocomplete__title--facets');
		expect(facetsTitle).toHaveTextContent(args.facetsTitle);

		let contentTitle = rendered.container.querySelector('.ss__autocomplete__title--content');
		expect(contentTitle).toHaveTextContent(args.contentTitle);
	});

	it('can set a custom trending title', async () => {
		const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
			trendingTitle: 'Lorem Ipsum',
		};

		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.query.blank' });

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

		let rendered = render(<Autocomplete {...args} />, { container });
		let trendingTitle = rendered.container.querySelector('.ss__autocomplete__title--trending');
		expect(trendingTitle).toHaveTextContent(args.trendingTitle);
	});

	it('can se custom slots, such as termsSlot, facetsSlot, resultsSlot, linkSlot', async () => {
		const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
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

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

		let rendered = render(<Autocomplete {...args} />, { container });

		let termsSlot = rendered.container.querySelector('.ss__autocomplete__terms');
		expect(termsSlot).toHaveTextContent('custom termsSlot');

		let facetSlot = rendered.container.querySelector('.ss__autocomplete__facets');
		expect(facetSlot).toHaveTextContent('custom facetsSlot');

		let resultsSlot = rendered.container.querySelector('.ss__autocomplete__content__results');
		let defaultTitle = rendered.container.querySelector('.ss__autocomplete__title--content');
		expect(defaultTitle).not.toBeInTheDocument();
		expect(resultsSlot).toHaveTextContent('custom resultsSlot');

		let defaultLink = rendered.container.querySelector('.ss__autocomplete__content__info');
		let linkSlot = rendered.container.querySelector('.ss__autocomplete__content #findMe');

		expect(defaultLink).not.toBeInTheDocument();
		expect(linkSlot).toHaveTextContent('custom linkSlot');
	});

	//cant render both content slot and results slot at the same time.
	it('can set a custom content slot', async () => {
		const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
			contentSlot: <div>Lorem Ipsum</div>,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

		let rendered = render(<Autocomplete {...args} />, { container });
		let contentSlot = rendered.container.querySelector('.ss__autocomplete__content');
		expect(contentSlot).toHaveTextContent('Lorem Ipsum');
	});

	// needs own term
	it('can set a custom noResults slot', async () => {
		const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
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

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

		let rendered = render(<Autocomplete {...args} />, { container });
		let noResultsSlot = rendered.container.querySelector('.ss__autocomplete__content__no-results');
		expect(noResultsSlot).toHaveTextContent('Lorem Ipsum');
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

		const controller = createAutocompleteController({ client: config, controller: trendingACConfig }, { client: mockClient });
		await controller.bind();

		const args = {
			controller,
			input: controller.config.selector,
		};

		const input = document.querySelector('.searchspring-ac');
		(input as HTMLInputElement).focus();

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

		const rendered = render(<Autocomplete {...args} />, { container });

		const autocomplete = rendered.container.querySelector('.ss__autocomplete');
		expect(autocomplete).toBeInTheDocument();

		const terms = rendered.container.querySelectorAll('.ss__autocomplete__terms__option');
		expect(terms.length).toBe(controller.store.trending.length);

		expect(terms[0]).toHaveClass('ss__autocomplete__terms__option--active');

		expect(controller.store.trending[0].active).toBeTruthy();

		let results = rendered.container.querySelectorAll('.ss__result');
		expect(results[0]).toBeInTheDocument();
	});

	it('can set a custom css width', async () => {
		const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
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

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

		let rendered = render(<Autocomplete {...args} />, { container });
		let ac = rendered.container.querySelector('.ss__autocomplete')!;
		const styles = getComputedStyle(ac);
		expect(styles['width']).toBe(args.width);

		let rendered2 = render(<Autocomplete {...args2} />, { container });
		let ac2 = rendered2.container.querySelector('.ss__autocomplete')!;
		const styles2 = getComputedStyle(ac2);
		expect(styles2['width']).toBe(args2.width);
	});

	it('can use breakpoints', async () => {
		const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
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

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

		let rendered = render(<Autocomplete {...args} />, { container });
		let acFacets = rendered.container.querySelector('.ss__autocomplete .ss__autocomplete__facets');

		expect(acFacets).toBeInTheDocument();

		// Change the viewport to 500px.
		global.innerWidth = 500;

		// Trigger the window resize event.
		global.dispatchEvent(new Event('resize'));

		// to deal with timeoutDelay setTimeout used in focus event
		await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

		// acFacets = rendered.container.querySelector('.ss__autocomplete .ss__autocomplete__facets');
		expect(acFacets).not.toBeInTheDocument();
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

			const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
			await controller.bind();

			const args = {
				controller,
				input: controller.config.selector,
			};

			const input = document.querySelector('.searchspring-ac');
			(input as HTMLInputElement).focus();

			// to deal with timeoutDelay setTimeout used in focus event
			await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Autocomplete {...args} />
				</ThemeProvider>,
				{ container }
			);

			const element = rendered.container.querySelector('.ss__autocomplete__title h5');
			expect(element).toBeInTheDocument();
			expect(element).toHaveTextContent(globalTheme.components.autocomplete.trendingTitle);
		});

		it('is themeable with theme prop', async () => {
			const propTheme = {
				components: {
					autocomplete: {
						trendingTitle: 'Lorem Ipsum',
					},
				},
			};

			const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
			await controller.bind();

			const args = {
				controller,
				input: controller.config.selector,
			};

			const input = document.querySelector('.searchspring-ac');
			(input as HTMLInputElement).focus();

			// to deal with timeoutDelay setTimeout used in focus event
			await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

			const rendered = render(<Autocomplete {...args} theme={propTheme} />, { container });

			const element = rendered.container.querySelector('.ss__autocomplete__title h5');
			expect(element).toBeInTheDocument();
			expect(element).toHaveTextContent(propTheme.components.autocomplete.trendingTitle);
		});

		it('is theme prop overrides ThemeProvider', async () => {
			const globalTheme = {
				components: {
					autocomplete: {
						trendingTitle: 'shouldnt find this',
					},
				},
			};
			const propTheme = {
				components: {
					autocomplete: {
						trendingTitle: 'should find this',
					},
				},
			};

			const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
			await controller.bind();

			const args = {
				controller,
				input: controller.config.selector,
			};

			const input = document.querySelector('.searchspring-ac');
			(input as HTMLInputElement).focus();

			// to deal with timeoutDelay setTimeout used in focus event
			await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Autocomplete {...args} theme={propTheme} />
				</ThemeProvider>,
				{ container }
			);

			const element = rendered.container.querySelector('.ss__autocomplete__title h5');
			expect(element).toBeInTheDocument();
			expect(element).toHaveTextContent(propTheme.components.autocomplete.trendingTitle);
			expect(element).not.toHaveTextContent(globalTheme.components.autocomplete.trendingTitle);
		});

		it('breakpoints override theme prop', async () => {
			// Change the viewport to 500px.
			global.innerWidth = 1200;

			// Trigger the window resize event.
			global.dispatchEvent(new Event('resize'));

			const controller = createAutocompleteController({ client: config, controller: acConfig }, { client: mockClient });
			await controller.bind();

			const theme = {
				components: {
					facet: {
						limit: 9,
					},
				},
			};

			const customBreakpoints = {
				0: {},
				700: {
					theme: {
						components: {
							facet: {
								limit: 4,
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

			// to deal with timeoutDelay setTimeout used in focus event
			await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

			let rendered = render(<Autocomplete {...args} />, { container });
			let acFacet = rendered.container.querySelector('.ss__autocomplete .ss__facet')!;

			let options = acFacet.querySelectorAll('.ss__facet__options a');

			expect(options).toHaveLength(customBreakpoints[700].theme.components.facet.limit);

			// Change the viewport to 500px.
			global.innerWidth = 500;

			// Trigger the window resize event.
			global.dispatchEvent(new Event('resize'));

			// to deal with timeoutDelay setTimeout used in focus event
			await new Promise((r) => setTimeout(r, INPUT_DELAY + 100));

			options = acFacet.querySelectorAll('.ss__facet__options a');

			expect(options?.length).toEqual(theme.components.facet.limit);
		});
	});
});

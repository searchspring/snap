import 'whatwg-fetch';
import { h } from 'preact';
import { v4 as uuidv4 } from 'uuid';
import { render } from '@testing-library/preact';
import { MockClient } from '@searchspring/snap-shared';
import { AutocompleteControllerConfig } from '@searchspring/snap-controller';
import { createAutocompleteController } from '../../../../../src/create';
import { waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { AutocompleteFixed, AutocompleteFixedProps } from './AutocompleteFixed';

describe('AutocompleteFixed Component', () => {
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

	const renderedInputSelector = '.autocomplete-fixed__search-input .ss__search-input__input';

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

		const args: AutocompleteFixedProps = {
			controller,
			input: controller.config.selector,
		};
		const rendered = render(<AutocompleteFixed {...args} />);
		const modal = rendered.container.querySelector('.ss__autocomplete-fixed');
		expect(modal).not.toBeInTheDocument();
		const autocompletetemplate = rendered.container.querySelector('.ss__autocomplete');
		expect(autocompletetemplate).not.toBeInTheDocument();
	});

	it('can set titles', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args: AutocompleteFixedProps = {
			controller,
			input: controller.config.selector,
			facetsTitle: 'custom facets title',
			contentTitle: 'custom content title',
			layout: ['facets', 'content'],
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;

		const rendered = render(<AutocompleteFixed {...args} />, { container });

		userEvent.click(input!);

		await waitFor(() => {
			const renderedInput = document.querySelector(renderedInputSelector) as HTMLInputElement;
			renderedInput.value = 'dress';

			const Facetstitle = rendered.container.querySelector('.ss__autocomplete__facets-wrapper .ss__autocomplete__title--facets');
			const Contenttitle = rendered.container.querySelector('.ss__autocomplete__content .ss__autocomplete__title--content');

			expect(Facetstitle).toBeInTheDocument();
			expect(Contenttitle).toBeInTheDocument();
			expect(Facetstitle?.textContent).toBe(args.facetsTitle);
			expect(Contenttitle?.textContent).toBe(args.contentTitle);
		});
	});

	it('can change layout', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();
		const args: AutocompleteFixedProps = {
			controller,
			input: controller.config.selector,
			layout: ['content', ['button.see-more']],
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;

		const rendered = render(<AutocompleteFixed {...args} />, { container });

		userEvent.click(input!);

		await waitFor(() => {
			const renderedInput = document.querySelector(renderedInputSelector) as HTMLInputElement;
			renderedInput.value = 'dress';

			const content = rendered.container.querySelector('.ss__autocomplete__content');
			const seemore = rendered.container.querySelector('.ss__autocomplete__row .ss__autocomplete__button--see-more');
			const c1 = rendered.container.querySelector('.ss__autocomplete__column--c1');
			const terms = rendered.container.querySelector('.ss__autocomplete__terms-wrapper');
			const facets = rendered.container.querySelector('.ss__autocomplete__facets-wrapper');
			const c2 = rendered.container.querySelector('.ss__autocomplete__column--c2');

			expect(content).toBeInTheDocument();
			expect(seemore).toBeInTheDocument();
			expect(c1).not.toBeInTheDocument();
			expect(terms).not.toBeInTheDocument();
			expect(facets).not.toBeInTheDocument();
			expect(c2).not.toBeInTheDocument();

			const results = rendered.container.querySelectorAll('.ss__autocomplete__content__results .ss__result');
			expect(results.length).toBeGreaterThan(0);
		});
	});

	it('auto adds banners with no layout', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();
		const args: AutocompleteFixedProps = {
			controller,
			input: controller.config.selector,
		};

		//note this test assumes there is a banner available on that term.. which at this time there is
		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.banners' });

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;

		const rendered = render(<AutocompleteFixed {...args} />, { container });

		userEvent.click(input!);

		await waitFor(() => {
			const renderedInput = document.querySelector(renderedInputSelector) as HTMLInputElement;
			renderedInput.value = 'dress';
			const bannerBanner = rendered.container.querySelector('.ss__autocomplete__content .ss__banner--banner');
			const headerBanner = rendered.container.querySelector('.ss__autocomplete__content .ss__banner--header');
			const footerBanner = rendered.container.querySelector('.ss__autocomplete__content .ss__banner--footer');

			expect(bannerBanner).toBeInTheDocument();
			expect(headerBanner).toBeInTheDocument();
			expect(footerBanner).toBeInTheDocument();
		});
	});

	it('auto adds banners with custom layout', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();
		const args: AutocompleteFixedProps = {
			controller,
			input: controller.config.selector,
			layout: ['c1', 'c2', 'c3'],
		};

		//note this test assumes there is a banner available on that term.. which at this time there is
		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.banners' });

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;

		const rendered = render(<AutocompleteFixed {...args} />, { container });

		userEvent.click(input!);

		await waitFor(() => {
			const renderedInput = document.querySelector(renderedInputSelector) as HTMLInputElement;
			renderedInput.value = 'dress';
			const leftBanner = rendered.container.querySelector('.ss__autocomplete__facets .ss__banner--left');
			const bannerBanner = rendered.container.querySelector('.ss__autocomplete__content .ss__banner--banner');
			const headerBanner = rendered.container.querySelector('.ss__autocomplete__content .ss__banner--header');
			const footerBanner = rendered.container.querySelector('.ss__autocomplete__content .ss__banner--footer');

			expect(leftBanner).toBeInTheDocument();
			expect(bannerBanner).toBeInTheDocument();
			expect(headerBanner).toBeInTheDocument();
			expect(footerBanner).toBeInTheDocument();
		});
	});

	it('can exclude auto banners', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();
		const args: AutocompleteFixedProps = {
			controller,
			input: controller.config.selector,
			excludeBanners: true,
		};

		//note this test assumes there is a banner available on that term.. which at this time there is
		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.banners' });

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;

		const rendered = render(<AutocompleteFixed {...args} />, { container });

		userEvent.click(input!);

		await waitFor(() => {
			const renderedInput = document.querySelector(renderedInputSelector) as HTMLInputElement;
			renderedInput.value = 'dress';
			const leftBanner = rendered.container.querySelector('.ss__autocomplete__facets .ss__banner--left');
			const bannerBanner = rendered.container.querySelector('.ss__autocomplete__content .ss__banner--banner');
			const headerBanner = rendered.container.querySelector('.ss__autocomplete__content .ss__banner--header');
			const footerBanner = rendered.container.querySelector('.ss__autocomplete__content .ss__banner--footer');

			expect(leftBanner).not.toBeInTheDocument();
			expect(bannerBanner).not.toBeInTheDocument();
			expect(headerBanner).not.toBeInTheDocument();
			expect(footerBanner).not.toBeInTheDocument();
		});
	});

	it('can manually add back banners auto banners', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();
		const args: AutocompleteFixedProps = {
			controller,
			input: controller.config.selector,
			excludeBanners: true,
			layout: ['c4', 'c1', 'c2', 'c3'],
			column4: {
				width: 'auto',
				layout: ['banner.banner', 'banner.footer', 'banner.header', 'banner.left'],
			},
		};

		//note this test assumes there is a banner available on that term.. which at this time there is
		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.banners' });

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;

		const rendered = render(<AutocompleteFixed {...args} />, { container });

		userEvent.click(input!);

		await waitFor(() => {
			const renderedInput = document.querySelector(renderedInputSelector) as HTMLInputElement;
			renderedInput.value = 'dress';
			const leftBanner = rendered.container.querySelector('.ss__autocomplete__column--c4 .ss__banner--left');
			const bannerBanner = rendered.container.querySelector('.ss__autocomplete__column--c4 .ss__banner--banner');
			const headerBanner = rendered.container.querySelector('.ss__autocomplete__column--c4 .ss__banner--header');
			const footerBanner = rendered.container.querySelector('.ss__autocomplete__column--c4 .ss__banner--footer');

			expect(leftBanner).toBeInTheDocument();
			expect(bannerBanner).toBeInTheDocument();
			expect(headerBanner).toBeInTheDocument();
			expect(footerBanner).toBeInTheDocument();
		});
	});
});

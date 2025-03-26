import 'whatwg-fetch';
import { h } from 'preact';
import { v4 as uuidv4 } from 'uuid';
import { render } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';

import { ThemeProvider } from '../../../providers';
import { AutocompleteTemplate, AutocompleteTemplateProps } from '../AutocompleteTemplate/AutocompleteTemplate';
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

		const args: AutocompleteTemplateProps = {
			controller,
			input: controller.config.selector,
		};
		const rendered = render(<AutocompleteTemplate {...args} />);

		const autocomplete = rendered.container.querySelector('.ss__autocomplete');
		expect(autocomplete).not.toBeInTheDocument();
	});

	it('renders after input has been focused', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args: AutocompleteTemplateProps = {
			controller,
			input: controller.config.selector,
		};

		const input = document.querySelector('.searchspring-ac');
		(input as HTMLInputElement).focus();

		const rendered = render(<AutocompleteTemplate {...args} />, { container });

		await waitFor(() => {
			const autocomplete = rendered.container.querySelector('.ss__autocomplete');
			expect(autocomplete).toBeInTheDocument();
		});
	});

	it('renders with expected default layout', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args: AutocompleteTemplateProps = {
			controller,
			input: controller.config.selector,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		const rendered = render(<AutocompleteTemplate {...args} />, { container });

		await waitFor(() => {
			const c4 = rendered.container.querySelector('.ss__autocomplete__column--c4');
			const c1Terms = rendered.container.querySelector('.ss__autocomplete__column--c1 .ss__autocomplete__terms-wrapper');
			const c2Facets = rendered.container.querySelector('.ss__autocomplete__column--c2 .ss__autocomplete__facets-wrapper');
			const c3Content = rendered.container.querySelector('.ss__autocomplete__column--c3 .ss__autocomplete__content');
			const c3seeMore = rendered.container.querySelector('.ss__autocomplete__column--c3 .ss__autocomplete__button--see-more');

			expect(c1Terms).toBeInTheDocument();
			expect(c2Facets).toBeInTheDocument();
			expect(c3Content).toBeInTheDocument();
			expect(c3seeMore).toBeInTheDocument();
			expect(c4).not.toBeInTheDocument();

			const results = rendered.container.querySelectorAll('.ss__autocomplete__content__results .ss__result');

			expect(results.length).toBeGreaterThan(0);
		});
	});

	it('can set titles', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();

		const args: AutocompleteTemplateProps = {
			controller,
			input: controller.config.selector,
			facetsTitle: 'custom facets title',
			contentTitle: 'custom content title',
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		const rendered = render(<AutocompleteTemplate {...args} />, { container });

		await waitFor(() => {
			const c2Facetstitle = rendered.container.querySelector(
				'.ss__autocomplete__column--c2 .ss__autocomplete__facets-wrapper .ss__autocomplete__title--facets'
			);
			const c3Contenttitle = rendered.container.querySelector(
				'.ss__autocomplete__column--c3 .ss__autocomplete__content .ss__autocomplete__title--content'
			);

			expect(c2Facetstitle).toBeInTheDocument();
			expect(c3Contenttitle).toBeInTheDocument();
			expect(c2Facetstitle?.textContent).toBe(args.facetsTitle);
			expect(c3Contenttitle?.textContent).toBe(args.contentTitle);
		});
	});

	it('can change c1 with column1layout', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();
		const args: AutocompleteTemplateProps = {
			controller,
			input: controller.config.selector,
			column1Layout: [['Facets', 'Content']],
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		const rendered = render(<AutocompleteTemplate {...args} />, { container });

		await waitFor(() => {
			const c4 = rendered.container.querySelector('.ss__autocomplete__column--c4');

			const c1Terms = rendered.container.querySelector('.ss__autocomplete__column--c1 .ss__autocomplete__terms-wrapper');
			const c1Facets = rendered.container.querySelector('.ss__autocomplete__column--c1 .ss__autocomplete__facets-wrapper');
			const c1Content = rendered.container.querySelector('.ss__autocomplete__column--c1 .ss__autocomplete__content');

			expect(c1Terms).not.toBeInTheDocument();
			expect(c1Facets).toBeInTheDocument();
			expect(c1Content).toBeInTheDocument();
			expect(c4).not.toBeInTheDocument();

			const results = rendered.container.querySelectorAll('.ss__autocomplete__content__results .ss__result');

			expect(results.length).toBeGreaterThan(0);
		});
	});

	it('can change c2 with column2layout', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();
		const args: AutocompleteTemplateProps = {
			controller,
			input: controller.config.selector,
			column2Layout: [['TermsList', 'Content']],
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		const rendered = render(<AutocompleteTemplate {...args} />, { container });

		await waitFor(() => {
			const c4 = rendered.container.querySelector('.ss__autocomplete__column--c4');

			const c2Terms = rendered.container.querySelector('.ss__autocomplete__column--c2 .ss__autocomplete__terms-wrapper');
			const c2Facets = rendered.container.querySelector('.ss__autocomplete__column--c2 .ss__autocomplete__facets-wrapper');
			const c2Content = rendered.container.querySelector('.ss__autocomplete__column--c2 .ss__autocomplete__content');

			expect(c2Terms).toBeInTheDocument();
			expect(c2Facets).not.toBeInTheDocument();
			expect(c2Content).toBeInTheDocument();
			expect(c4).not.toBeInTheDocument();

			const results = rendered.container.querySelectorAll('.ss__autocomplete__content__results .ss__result');
			expect(results.length).toBeGreaterThan(0);
		});
	});

	it('can change c3 with column3layout', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();
		const args: AutocompleteTemplateProps = {
			controller,
			input: controller.config.selector,
			column3Layout: [['Facets', 'TermsList']],
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		const rendered = render(<AutocompleteTemplate {...args} />, { container });

		await waitFor(() => {
			const c4 = rendered.container.querySelector('.ss__autocomplete__column--c4');

			const c3Terms = rendered.container.querySelector('.ss__autocomplete__column--c3 .ss__autocomplete__terms-wrapper');
			const c3Facets = rendered.container.querySelector('.ss__autocomplete__column--c3 .ss__autocomplete__facets-wrapper');
			const c3Content = rendered.container.querySelector('.ss__autocomplete__column--c3 .ss__autocomplete__content');

			expect(c3Terms).toBeInTheDocument();
			expect(c3Facets).toBeInTheDocument();
			expect(c3Content).not.toBeInTheDocument();
			expect(c4).not.toBeInTheDocument();

			const results = rendered.container.querySelectorAll('.ss__autocomplete__content__results .ss__result');
			expect(results.length).toBe(0);
		});
	});

	it('can change and render c4 with column4layout', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();
		const args: AutocompleteTemplateProps = {
			controller,
			input: controller.config.selector,
			layout: ['C1', 'C2', 'C3', 'C4'],
			column4Layout: [['Facets']],
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		const rendered = render(<AutocompleteTemplate {...args} />, { container });

		await waitFor(() => {
			const c4Terms = rendered.container.querySelector('.ss__autocomplete__column--c4 .ss__autocomplete__terms-wrapper');
			const c4Facets = rendered.container.querySelector('.ss__autocomplete__column--c4 .ss__autocomplete__facets-wrapper');
			const c4Content = rendered.container.querySelector('.ss__autocomplete__column--c4 .ss__autocomplete__content');

			expect(c4Terms).not.toBeInTheDocument();
			expect(c4Facets).toBeInTheDocument();
			expect(c4Content).not.toBeInTheDocument();

			const results = rendered.container.querySelectorAll('.ss__autocomplete__content__results .ss__result');

			expect(results.length).toBeGreaterThan(0);
		});
	});

	it('can change layout', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();
		const args: AutocompleteTemplateProps = {
			controller,
			input: controller.config.selector,
			layout: ['Content', ['Button.see-more']],
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		input.value = 'dress';

		const rendered = render(<AutocompleteTemplate {...args} />, { container });

		await waitFor(() => {
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
		const args: AutocompleteTemplateProps = {
			controller,
			input: controller.config.selector,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		//note this test assumes there is a banner available on that term.. which at this time there is
		//todo use a mock for this
		input.value = 'dress';
		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.banners' });

		const rendered = render(<AutocompleteTemplate {...args} />, { container });

		await waitFor(() => {
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

	it('auto adds banners with custom layout', async () => {
		const controller = createAutocompleteController({ client: clientConfig, controller: acConfig }, { client: mockClient });
		await controller.bind();
		const args: AutocompleteTemplateProps = {
			controller,
			input: controller.config.selector,
			layout: ['C1', 'C2', 'C3'],
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		//note this test assumes there is a banner available on that term.. which at this time there is
		//todo use a mock for this
		input.value = 'dress';
		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.banners' });

		const rendered = render(<AutocompleteTemplate {...args} />, { container });

		await waitFor(() => {
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
		const args: AutocompleteTemplateProps = {
			controller,
			input: controller.config.selector,
			excludeBanners: true,
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		//note this test assumes there is a banner available on that term.. which at this time there is
		//todo use a mock for this
		input.value = 'dress';
		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.banners' });

		const rendered = render(<AutocompleteTemplate {...args} />, { container });

		await waitFor(() => {
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
		const args: AutocompleteTemplateProps = {
			controller,
			input: controller.config.selector,
			excludeBanners: true,
			layout: ['C4', 'C1', 'C2', 'C3'],
			column4Layout: ['Banner.banner', 'Banner.footer', 'Banner.header', 'Banner.left'],
		};

		const input = document.querySelector('.searchspring-ac') as HTMLInputElement;
		input.focus();
		//note this test assumes there is a banner available on that term.. which at this time there is
		//todo use a mock for this
		input.value = 'dress';
		(controller.client as MockClient).mockData.updateConfig({ autocomplete: 'ac.banners' });

		const rendered = render(<AutocompleteTemplate {...args} />, { container });

		await waitFor(() => {
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

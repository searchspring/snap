import { h } from 'preact';
import { v4 as uuidv4 } from 'uuid';
import { render } from '@testing-library/preact';

import { Autocomplete } from '../../Organisms/Autocomplete/Autocomplete';
import type { AutocompleteController } from '@searchspring/snap-controller';

import { Snap } from '@searchspring/snap-preact';

let config;
let controllerConfigId;
describe('Autocomplete Component', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="target">' + '  <input type="text" class="searchspring-ac">' + '</div>';
		controllerConfigId = uuidv4().split('-').join('');
		config = {
			client: {
				globals: {
					siteId: '8uyt2m',
				},
			},
			controllers: {
				autocomplete: [
					{
						config: {
							id: controllerConfigId,
							selector: 'input.searchspring-ac',
							settings: {
								trending: {
									limit: 5,
								},
							},
						},
						targets: [
							{
								selector: '#target',
								component: () => Autocomplete,
								hideTarget: true,
							},
						],
					},
				],
			},
		};
	});

	it('contains an input element on the page', () => {
		const input = document.querySelector('.searchspring-ac');
		expect(input).toBeInTheDocument();
	});
	it('does not render if input have not been focused', () => {
		const snap = new Snap(config as any);
		const args = {
			controller: snap.controllers[controllerConfigId] as AutocompleteController,
			input: config.controllers.autocomplete[0].config.selector,
		};
		const rendered = render(<Autocomplete {...args} />);

		const autocomplete = rendered.container.querySelector('.ss__autocomplete');
		expect(autocomplete).not.toBeInTheDocument();
	});
	it('renders after input has been focused', async () => {
		const snap = new Snap(config as any);
		const args = {
			controller: snap.controllers[controllerConfigId] as AutocompleteController,
			input: config.controllers.autocomplete[0].config.selector,
		};

		const input = document.querySelector('.searchspring-ac');
		(input as HTMLInputElement).focus();
		await new Promise((r) => setTimeout(r, 1000));

		const rendered = render(<Autocomplete {...args} />);

		const autocomplete = rendered.container.querySelector('.ss__autocomplete');
		expect(autocomplete).toBeInTheDocument();
	});
});

import { h } from 'preact';
import { v4 as uuidv4 } from 'uuid';
import { render } from '@testing-library/preact';

import { Autocomplete } from '../../Organisms/Autocomplete/Autocomplete';
import { createAutocompleteController } from '@searchspring/snap-preact';

const client = {
	globals: {
		siteId: '8uyt2m',
	},
};
let config;
let controllerConfigId;
describe('Autocomplete Component', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div>' + '  <input type="text" class="searchspring-ac">' + '<div id="target"></div></div>';
		controllerConfigId = uuidv4().split('-').join('');
		config = {
			id: controllerConfigId,
			selector: 'input.searchspring-ac',
			settings: {
				trending: {
					limit: 5,
				},
			},
		};
	});

	it('contains an input element on the page', () => {
		const input = document.querySelector('.searchspring-ac');
		expect(input).toBeInTheDocument();
	});
	it('does not render if input have not been focused', () => {
		const controller = createAutocompleteController({ client, controller: config });
		const args = {
			controller,
			input: controller.config.selector,
		};
		const rendered = render(<Autocomplete {...args} />);

		const autocomplete = rendered.container.querySelector('.ss__autocomplete');
		expect(autocomplete).not.toBeInTheDocument();
	});

	it('renders after input has been focused', async () => {
		const controller = createAutocompleteController({ client, controller: config });
		const args = {
			controller,
			input: controller.config.selector,
		};
		controller.bind();

		const input = document.querySelector('.searchspring-ac');
		(input as HTMLInputElement).focus();
		await new Promise((r) => setTimeout(r, 1000));

		const rendered = render(<Autocomplete {...args} />, { container: document.getElementById('target') });
		const autocomplete = rendered.container.querySelector('.ss__autocomplete');
		expect(autocomplete).toBeInTheDocument();
	});
});

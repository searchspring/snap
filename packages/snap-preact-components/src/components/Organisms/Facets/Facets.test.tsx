import { h } from 'preact';
import { render } from '@testing-library/preact';
import { Facets } from './Facets';
import { searchResponse } from '../../../mocks/searchResponse';

describe('Facets Component', () => {
	it('renders', () => {
		const args = {
			facets: searchResponse.facets,
		};
		const rendered = render(<Facets {...args} />);
		const facetsElement = rendered.container.querySelector('.ss-facets');
		expect(facetsElement).toBeInTheDocument();
	});

	it('has all facets', () => {
		const args = {
			facets: searchResponse.facets,
		};
		const rendered = render(<Facets {...args} />);
		const facetsElement = rendered.container.querySelector('.ss-facets');
		const count = facetsElement.querySelectorAll('.ss-facet').length;
		expect(count).toBe(args.facets.length);
	});
});

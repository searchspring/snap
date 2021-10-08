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
		const facetsElement = rendered.container.querySelector('.ss__facets');
		expect(facetsElement).toBeInTheDocument();
	});

	it('has all facets', () => {
		const args = {
			facets: searchResponse.facets,
		};
		const rendered = render(<Facets {...args} />);
		const facetsElement = rendered.container.querySelector('.ss__facets');
		const count = facetsElement.querySelectorAll('.ss__facet').length;
		expect(count).toBe(args.facets.length);
	});

	it('has limited facets with limit prop', () => {
		const args = {
			facets: searchResponse.facets,
			limit: 2,
		};
		const rendered = render(<Facets {...args} />);
		const facetsElement = rendered.container.querySelector('.ss__facets');
		const count = facetsElement.querySelectorAll('.ss__facet').length;
		expect(count).toBeLessThanOrEqual(args.facets.length);
		expect(count).toBe(args.limit);
	});
});

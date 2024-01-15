import { h } from 'preact';
import { render } from '@testing-library/preact';
import { HorizontalFacets } from './HorizontalFacets';
import { IndividualFacetType } from '../Facets/Facets';
import { ThemeProvider } from '../../../providers';
import userEvent from '@testing-library/user-event';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModel } from '@searchspring/snapi-types';

const mockData = new MockData();
const searchResponse: SearchResponseModel = mockData.search();

describe('HorizontalFacets Component', () => {
	it('renders', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};
		const rendered = render(<HorizontalFacets {...args} />);
		const horizontalFacetsElement = rendered.container.querySelector('.ss__horizontal-facets');
		expect(horizontalFacetsElement).toBeInTheDocument();
	});
});

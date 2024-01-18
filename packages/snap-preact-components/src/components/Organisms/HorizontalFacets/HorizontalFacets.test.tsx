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

	it('limits number of facets and displays sidebar overflow', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			limit: 2,
		};
		const rendered = render(<HorizontalFacets {...args} />);
		const facetsDropdown = rendered.container.querySelectorAll('.ss__horizontal-facets__header__dropdown');
		expect(facetsDropdown).toHaveLength(args.limit);

		const mobileSidebar = rendered.container.querySelector('.ss__horizontal-facets__header__mobile-sidebar');
		expect(mobileSidebar).toBeInTheDocument();
	});

	it('always shows overflow using alwaysShowFiltersButton', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			alwaysShowFiltersButton: true,
		};
		const rendered = render(<HorizontalFacets {...args} />);

		const mobileSidebar = rendered.container.querySelector('.ss__horizontal-facets__header__mobile-sidebar');
		expect(mobileSidebar).toBeInTheDocument();
	});

	it('renders as dropdown overlay using overlay prop', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			overlay: true,
		};
		const rendered = render(<HorizontalFacets {...args} />);

		const mobileSidebar = rendered.container.querySelector(
			'.ss__horizontal-facets__header__dropdown .ss__dropdown__content .ss__horizontal-facets__content__facet--horizontalOverlayFacet'
		);
		expect(mobileSidebar).toBeInTheDocument();
	});

	it('renders with className', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			className: 'classy',
		};

		const rendered = render(<HorizontalFacets {...args} />);

		const horizontalFacetsElement = rendered.container.querySelector('.ss__horizontal-facets');
		expect(horizontalFacetsElement).toHaveClass(args.className);
	});

	it('disableStyles', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			disableStyles: true,
		};

		const rendered = render(<HorizontalFacets {...args} />);

		const horizontalFacetsElement = rendered.container.querySelector('.ss__horizontal-facets');
		expect(horizontalFacetsElement?.classList).toHaveLength(1);
	});

	it('is themeable with ThemeProvider', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};
		const globalTheme = {
			components: {
				horizontalFacets: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<HorizontalFacets {...args} />
			</ThemeProvider>
		);
		const horizontalFacetsElement = rendered.container.querySelector('.ss__horizontal-facets');
		expect(horizontalFacetsElement).toBeInTheDocument();
		expect(horizontalFacetsElement).toHaveClass(globalTheme.components.horizontalFacets.className);
	});

	it('is themeable with theme prop', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};
		const propTheme = {
			components: {
				horizontalFacets: {
					className: 'classy',
				},
			},
		};
		const rendered = render(<HorizontalFacets {...args} theme={propTheme} />);
		const horizontalFacetsElement = rendered.container.querySelector('.ss__horizontal-facets');
		expect(horizontalFacetsElement).toBeInTheDocument();
		expect(horizontalFacetsElement).toHaveClass(propTheme.components.horizontalFacets.className);
	});

	it('is theme prop overrides ThemeProvider', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};
		const globalTheme = {
			components: {
				horizontalFacets: {
					className: 'notClassy',
				},
			},
		};
		const propTheme = {
			components: {
				horizontalFacets: {
					className: 'classy',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<HorizontalFacets {...args} theme={propTheme} />
			</ThemeProvider>
		);

		const horizontalFacetsElement = rendered.container.querySelector('.ss__horizontal-facets');
		expect(horizontalFacetsElement).toBeInTheDocument();
		expect(horizontalFacetsElement).toHaveClass(propTheme.components.horizontalFacets.className);
		expect(horizontalFacetsElement).not.toHaveClass(globalTheme.components.horizontalFacets.className);
	});
});

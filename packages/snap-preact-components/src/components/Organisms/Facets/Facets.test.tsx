import { h } from 'preact';
import { render } from '@testing-library/preact';
import { Facets, IndividualFacetType } from './Facets';
import { ThemeProvider } from '../../../providers';
import userEvent from '@testing-library/user-event';

import { MockData } from '@searchspring/snap-shared';
import { SearchResponseModel } from '@searchspring/snapi-types';

const mockData = new MockData();
const searchResponse: SearchResponseModel = mockData.search();

describe('Facets Component', () => {
	it('renders', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};
		const rendered = render(<Facets {...args} />);
		const facetsElement = rendered.container.querySelector('.ss__facets');
		expect(facetsElement).toBeInTheDocument();
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has all facets', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
		};
		const rendered = render(<Facets {...args} />);
		const facetsElement = rendered.container.querySelector('.ss__facets');
		const count = facetsElement?.querySelectorAll('.ss__facet').length;
		expect(count).toBe(args.facets.length);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('has limited facets with limit prop', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			limit: 2,
		};
		const rendered = render(<Facets {...args} />);
		const facetsElement = rendered.container.querySelector('.ss__facets');
		const count = facetsElement?.querySelectorAll('.ss__facet').length;
		expect(count).toBeLessThanOrEqual(args.facets.length);
		expect(count).toBe(args.limit);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('renders with classname', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			className: 'classy',
		};

		const rendered = render(<Facets {...args} />);

		const facetsElement = rendered.container.querySelector('.ss__facets');
		expect(facetsElement).toHaveClass(args.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('disables styles', () => {
		const args = {
			facets: searchResponse.facets as IndividualFacetType[],
			disableStyles: true,
		};

		const rendered = render(<Facets {...args} />);

		const facetsElement = rendered.container.querySelector('.ss__facets');
		expect(facetsElement?.classList).toHaveLength(1);
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});

describe('Facets Component is themeable', () => {
	const globalTheme = {
		components: {
			facets: {
				className: 'customClassName',
			},
		},
	};

	const args = {
		facets: searchResponse.facets as IndividualFacetType[],
		limit: 2,
	};

	it('is themeable with ThemeProvider', () => {
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Facets {...args} />
			</ThemeProvider>
		);
		const facetsElement = rendered.container.querySelector('.ss__facets');
		expect(facetsElement).toHaveClass(globalTheme.components.facets.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme prop', () => {
		const rendered = render(<Facets {...args} theme={globalTheme} />);
		const facetsElement = rendered.container.querySelector('.ss__facets');
		expect(facetsElement).toHaveClass(globalTheme.components.facets.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('is themeable with theme prop overrides ThemeProvider', () => {
		const theme = {
			components: {
				facets: {
					className: 'otherCustomClassName',
				},
			},
		};
		const rendered = render(
			<ThemeProvider theme={globalTheme}>
				<Facets {...args} theme={theme} />
			</ThemeProvider>
		);
		const facetsElement = rendered.container.querySelector('.ss__facets');
		expect(facetsElement).toHaveClass(theme.components.facets.className);
		expect(facetsElement).not.toHaveClass(globalTheme.components.facets.className);
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('can pass child component props via the theme', () => {
		const clickFunc = jest.fn();
		const theme2 = {
			components: {
				facetListOptions: {
					onClick: clickFunc,
				},
			},
		};

		const rendered = render(<Facets {...args} theme={theme2} />);

		expect(clickFunc).not.toHaveBeenCalled();
		expect(rendered.asFragment()).toMatchSnapshot();

		const resultElement = rendered.container.querySelector('.ss__facet-list-options__option')!;
		userEvent.click(resultElement);

		expect(clickFunc).toHaveBeenCalled();
		expect(rendered.asFragment()).toMatchSnapshot();
	});
});

import { h } from 'preact';
import { render } from '@testing-library/preact';
import { Facet } from './Facet';
import { searchResponse, listFacetMock, paletteFacetMock, gridFacetMock } from '../../../mocks/searchResponse';
import { FacetDisplay, ValueFacet } from '../../../types';

describe('Facet Component', () => {
	//TODO: type: FacetType and display: FacetDisplay in interface BaseFacet not compatible with searchResponse mock data?

	describe('List Facet Display', () => {
		it('renders', () => {
			const args = {
				facet: listFacetMock as ValueFacet,
			};
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();
			const count = facetElement.querySelectorAll('.ss__facet-list-options__option').length;
			expect(count).toEqual(args.facet['values'].length);
		});
	});

	describe('Grid Facet Display', () => {
		it('renders', () => {
			const args = {
				facet: gridFacetMock as ValueFacet,
			};
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();
			const count = facetElement.querySelectorAll('.ss__facet-grid-options__option').length;
			expect(count).toEqual(args.facet['values'].length);
		});
	});

	describe('Palette Facet Display', () => {
		it('renders', () => {
			const args = {
				facet: paletteFacetMock as ValueFacet,
			};
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet facet={args.facet} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();
			const count = facetElement.querySelectorAll('.ss__facet-palette-options__option').length;
			expect(count).toEqual(args.facet['values'].length);
		});
	});

	describe('Slider Facet Display', () => {
		it('renders', () => {
			const args = {
				facet: searchResponse.facets.filter((facet) => facet.display === FacetDisplay.SLIDER).pop(),
			};
			args.facet.collapsed = false;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();
			const sliderElement = facetElement.querySelector('.ss__slider');
			expect(sliderElement).toBeInTheDocument();
		});
	});

	//TODO: add hierarchy when available
});

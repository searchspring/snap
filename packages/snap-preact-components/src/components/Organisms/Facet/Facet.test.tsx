import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import { Facet } from './Facet';
import { ThemeProvider } from '../../../providers';
import { searchResponse, listFacetMock, paletteFacetMock, gridFacetMock, hierarchyFacetMock, facetOverflowMock } from '../../../mocks/searchResponse';
import { FacetDisplay } from '../../../types';
import userEvent from '@testing-library/user-event';
import { ValueFacet, RangeFacet } from '@searchspring/snap-store-mobx';
describe('Facet Component', () => {
	//TODO: type: FacetType and display: FacetDisplay in interface BaseFacet not compatible with searchResponse mock data!

	describe('List Facet Display', () => {
		it('renders', () => {
			const args = {
				facet: listFacetMock as ValueFacet,
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();
			const count = facetElement?.querySelectorAll('.ss__facet-list-options__option').length;
			expect(count).toEqual(args.facet['values'].length);
		});
	});

	describe('Grid Facet Display', () => {
		it('renders', () => {
			const args = {
				facet: gridFacetMock as unknown as ValueFacet,
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();
			const count = facetElement?.querySelectorAll('.ss__facet-grid-options__option').length;
			expect(count).toEqual(args.facet['values'].length);
		});
	});

	describe('Palette Facet Display', () => {
		it('renders', () => {
			const args = {
				facet: paletteFacetMock as ValueFacet,
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet facet={args.facet} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();
			const count = facetElement?.querySelectorAll('.ss__facet-palette-options__option').length;
			expect(count).toEqual(args.facet['values'].length);
		});
	});

	describe('Slider Facet Display', () => {
		it('renders', () => {
			const args = {
				facet: searchResponse.facets.filter((facet) => facet.display === FacetDisplay.SLIDER).pop() as RangeFacet,
			};
			args.facet.collapsed = false;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options')!;
			expect(facetElement).toBeInTheDocument();
			const sliderElement = facetElement.querySelector('.ss__facet-slider');
			expect(sliderElement).toBeInTheDocument();
		});
	});

	describe('Slider hierarchy Display', () => {
		it('renders', () => {
			const args = {
				facet: hierarchyFacetMock as unknown as ValueFacet,
			};
			args.facet.collapsed = false;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();
			const hierarchyElement = facetElement?.querySelector('.ss__facet-hierarchy-options');
			expect(hierarchyElement).toBeInTheDocument();
		});
	});

	describe('Facet props', () => {
		it('color prop', () => {
			const args = {
				facet: listFacetMock as ValueFacet,
				color: 'red',
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__header')!;
			expect(facetElement).toBeInTheDocument();
			const styles = getComputedStyle(facetElement);
			expect(styles.color).toBe(args.color);
		});

		it('show more/less text prop', async () => {
			const args = {
				facet: facetOverflowMock as unknown as ValueFacet,
				showMoreText: 'Show More please',
				showLessText: 'Show Less please',
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__show-more-less')!;
			expect(facetElement).toBeInTheDocument();
			expect(facetElement).toHaveTextContent(args.showMoreText);

			userEvent.click(facetElement);

			await waitFor(() => expect(facetElement).toHaveTextContent(args.showMoreText));
		});

		it('renders with specified icons', async () => {
			const args = {
				facet: facetOverflowMock as unknown as ValueFacet,
				iconCollapse: 'angle-down',
				iconExpand: 'angle-up',
				iconOverflowMore: 'check',
				iconOverflowLess: 'circle',
			};
			const rendered = render(<Facet {...args} />);

			const headerIconElement = rendered.container.querySelector('.ss__facet__header .ss__icon');
			const showMoreLessElem = rendered.container.querySelector('.ss__facet__show-more-less .ss__icon');

			expect(headerIconElement).toBeInTheDocument();
			expect(headerIconElement).toHaveClass(`ss__icon--${args.iconCollapse}`);
			expect(showMoreLessElem).toHaveClass(`ss__icon--${args.iconOverflowMore}`);

			args.facet.collapsed = false;

			const rendered2 = render(<Facet {...args} />);

			const headerIconElement2 = rendered2.container.querySelector('.ss__facet__header .ss__icon');
			const showMoreLessElem2 = rendered2.container.querySelector('.ss__facet__show-more-less .ss__icon');

			expect(headerIconElement2).toBeInTheDocument();
			expect(headerIconElement2).toHaveClass(`ss__icon--${args.iconCollapse}`);
			expect(showMoreLessElem2).toHaveClass(`ss__icon--${args.iconOverflowMore}`);
		});

		it('set custom overflow slot', async () => {
			const elem = <span className="findMe">Show More please</span>;
			const args = {
				facet: facetOverflowMock as unknown as ValueFacet,
				overflowSlot: elem,
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__show-more-less');
			expect(facetElement).toBeInTheDocument();
			const overflowSlot = rendered.container.querySelector('.findMe');
			expect(overflowSlot).toBeInTheDocument();
			expect(overflowSlot).toHaveTextContent('Show More please');
		});

		it('set custom options slot', async () => {
			const option = <span className="findMe">stuff and things</span>;
			const args = {
				facet: facetOverflowMock as unknown as ValueFacet,
				optionsSlot: option,
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();

			const optionsSlot = rendered.container.querySelector('.findMe');
			expect(optionsSlot).toBeInTheDocument();
			expect(optionsSlot).toHaveTextContent('stuff and things');
		});

		it('can use limit prop', async () => {
			const args = {
				facet: facetOverflowMock as unknown as ValueFacet,
				limit: 3,
				disableOverflow: true,
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelectorAll('.ss__facet-palette-options__option');

			expect(facetElement.length).toBe(args.limit);
		});

		it('can use searchable prop', async () => {
			const args = {
				facet: listFacetMock as ValueFacet,
				searchable: true,
			};

			const rendered = render(<Facet {...args} />);
			const searchInputElement = rendered.container.querySelector('.ss__search-input input')!;
			expect(searchInputElement).toBeInTheDocument();
			userEvent.type(searchInputElement, 'su');

			await waitFor(() => expect(searchInputElement).toHaveValue('su'));
			expect(searchInputElement).toHaveValue('su');

			const optionsElement = rendered.container.querySelector('.ss__facet__options');
			expect(optionsElement).toHaveTextContent('Summer');
		});
	});

	it('renders with classname', () => {
		const args = {
			facet: listFacetMock as ValueFacet,
			className: 'classy',
		};

		const rendered = render(<Facet {...args} />);

		const facetElement = rendered.container.querySelector('.ss__facet');
		expect(facetElement).toHaveClass(args.className);
	});

	it('disables styles', () => {
		const args = {
			facet: listFacetMock as ValueFacet,
			disableStyles: true,
		};

		const rendered = render(<Facet {...args} />);

		const facetElement = rendered.container.querySelector('.ss__facet');

		expect(facetElement?.classList).toHaveLength(3);
	});

	describe('Image theming works', () => {
		it('is themeable with ThemeProvider', () => {
			const globalTheme = {
				components: {
					facet: {
						className: 'classy',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Facet facet={listFacetMock as ValueFacet} />
				</ThemeProvider>
			);
			const facet = rendered.container.querySelector('.ss__facet');
			expect(facet).toBeInTheDocument();
			expect(facet).toHaveClass(globalTheme.components.facet.className);
		});

		it('is themeable with theme prop', () => {
			const propTheme = {
				components: {
					facet: {
						className: 'classy',
					},
				},
			};
			const rendered = render(<Facet facet={listFacetMock as ValueFacet} theme={propTheme} />);
			const facet = rendered.container.querySelector('.ss__facet');
			expect(facet).toBeInTheDocument();
			expect(facet).toHaveClass(propTheme.components.facet.className);
		});

		it('is theme prop overrides ThemeProvider', () => {
			const globalTheme = {
				components: {
					facet: {
						className: 'not classy',
					},
				},
			};
			const propTheme = {
				components: {
					facet: {
						className: 'classy',
					},
				},
			};
			const rendered = render(
				<ThemeProvider theme={globalTheme}>
					<Facet facet={listFacetMock as ValueFacet} theme={propTheme} />
				</ThemeProvider>
			);

			const facet = rendered.container.querySelector('.ss__facet');
			expect(facet).toBeInTheDocument();
			expect(facet).toHaveClass(propTheme.components.facet.className);
			expect(facet).not.toHaveClass(globalTheme.components.facet.className);
		});
	});
});

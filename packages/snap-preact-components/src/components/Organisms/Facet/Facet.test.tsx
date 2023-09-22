import { h } from 'preact';
import { render, waitFor } from '@testing-library/preact';
import { Facet } from './Facet';
import { ThemeProvider } from '../../../providers';
import themes from '../../../themes';

import userEvent from '@testing-library/user-event';
import { ValueFacet, RangeFacet } from '@searchspring/snap-store-mobx';
import { SearchResponseModelFacet, SearchResponseModelFacetValueAllOf } from '@searchspring/snapi-types';
import { MockData } from '@searchspring/snap-shared';

const mockData = new MockData();
const searchResponseFacets = mockData.search().facets!;

const hierarchyFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = searchResponseFacets
	.filter((facet) => facet.field == 'ss_category_hierarchy')!
	.pop()!;
const gridFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = searchResponseFacets
	.filter((facet) => facet.field == 'size_dress')!
	.pop()!;
const paletteFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = searchResponseFacets
	.filter((facet) => facet.field == 'color_family')!
	.pop()!;
const listFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = searchResponseFacets
	.filter((facet) => facet.field == 'season')!
	.pop()!;
const facetOverflowMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = searchResponseFacets
	.filter((facet) => facet.field == 'brand')!
	.pop()!;
const sliderFacetMock: SearchResponseModelFacet & SearchResponseModelFacetValueAllOf = searchResponseFacets
	.filter((facet) => facet.field == 'price')
	.pop()!;

//@ts-ignore
facetOverflowMock.overflow = {
	enabled: true,
	limited: true,
	limit: 12,
	remaining: 2,
	setLimit: () => {},
	toggle: () => {},
	calculate: () => {},
};

describe('Facet Component', () => {
	//TODO: type: FacetType and display: FacetDisplay in interface BaseFacet not compatible with searchResponse mock data!

	Object.keys(themes || {}).forEach((themeName) => {
		it(`uses ${themeName} theme`, () => {
			const theme = themes[themeName as keyof typeof themes];
			const rendered = render(<Facet theme={theme} facet={listFacetMock as ValueFacet} />);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

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
			expect(rendered.asFragment()).toMatchInlineSnapshot(`
			<DocumentFragment>
			  .emotion-0 {
			  width: 100%;
			  margin: 0 0 20px 0;
			}

			.emotion-0 .ss__facet__header {
			  display: -webkit-box;
			  display: -webkit-flex;
			  display: -ms-flexbox;
			  display: flex;
			  -webkit-box-pack: justify;
			  -webkit-justify-content: space-between;
			  justify-content: space-between;
			  -webkit-align-items: center;
			  -webkit-box-align: center;
			  -ms-flex-align: center;
			  align-items: center;
			  border: none;
			  border-bottom: 2px solid #ccc;
			  padding: 6px 0;
			}

			.emotion-0 .ss__facet__options {
			  margin-top: 8px;
			  max-height: 300px;
			  overflow-y: auto;
			  overflow-x: hidden;
			}

			.emotion-0 .ss__facet__show-more-less {
			  display: block;
			  margin: 8px;
			  cursor: pointer;
			}

			.emotion-0 .ss__facet__show-more-less .ss__icon {
			  margin-right: 8px;
			}

			.emotion-0 .ss__search-input {
			  margin: 16px 0 0 0;
			}

			.emotion-1 {
			  position: relative;
			}

			.emotion-1.ss__dropdown--open .ss__dropdown__content {
			  position: relative;
			  visibility: visible;
			  opacity: 1;
			}

			.emotion-1 .ss__dropdown__button {
			  cursor: default;
			}

			.emotion-1 .ss__dropdown__content {
			  position: absolute;
			  min-width: 100%;
			  visibility: hidden;
			  opacity: 0;
			  top: auto;
			  left: 0;
			}

			.emotion-2 {
			  width: 12px;
			  height: 12px;
			  position: relative;
			}

			.emotion-3 .ss__facet-list-options__option {
			  display: -webkit-box;
			  display: -webkit-flex;
			  display: -ms-flexbox;
			  display: flex;
			  padding: 6px;
			  -webkit-text-decoration: none;
			  text-decoration: none;
			  -webkit-align-items: center;
			  -webkit-box-align: center;
			  -ms-flex-align: center;
			  align-items: center;
			}

			.emotion-3 .ss__facet-list-options__option:hover {
			  cursor: pointer;
			}

			.emotion-3 .ss__facet-list-options__option.ss__facet-list-options__option--filtered {
			  font-weight: bold;
			}

			.emotion-3 .ss__facet-list-options__option .ss__facet-list-options__option__value {
			  margin-left: 8px;
			}

			.emotion-3 .ss__facet-list-options__option .ss__facet-list-options__option__value .ss__facet-list-options__option__value__count {
			  font-size: 0.8em;
			  margin-left: 6px;
			}

			.emotion-4 {
			  display: -webkit-inline-box;
			  display: -webkit-inline-flex;
			  display: -ms-inline-flexbox;
			  display: inline-flex;
			  -webkit-align-items: center;
			  -webkit-box-align: center;
			  -ms-flex-align: center;
			  align-items: center;
			  -webkit-box-pack: center;
			  -ms-flex-pack: center;
			  -webkit-justify-content: center;
			  justify-content: center;
			  height: 12px;
			  width: 12px;
			  border: 1px solid #333;
			}

			.emotion-4.ss__checkbox--disabled {
			  opacity: 0.7;
			}

			.emotion-4 .ss__checkbox__empty {
			  display: inline-block;
			  width: calc(12px - 30%);
			  height: calc(12px - 30%);
			}

			<div
			    class="ss__facet ss__facet--undefined ss__facet--season emotion-0"
			  >
			    <div
			      class="ss__dropdown ss__dropdown--open ss__facet__dropdown emotion-1"
			    >
			      <div
			        aria-expanded="true"
			        class="ss__dropdown__button"
			        role="button"
			      >
			        <div
			          aria-label="currently open undefined facet dropdown 4 options"
			          aria-level="3"
			          class="ss__facet__header"
			          open="true"
			          role="heading"
			          ssa11y="true"
			          tabindex="0"
			        >
			          <svg
			            class="ss__icon ss__icon--angle-up ss__facet__dropdown__icon emotion-2"
			            viewBox="0 0 56 56"
			            xmlns="http://www.w3.org/2000/svg"
			          >
			            <path
			              d="M56 39.671c0 0.449-0.224 0.954-0.561 1.291l-2.806 2.806c-0.337 0.337-0.786 0.561-1.291 0.561-0.449 0-0.954-0.224-1.291-0.561l-22.052-22.052-22.052 22.052c-0.337 0.337-0.842 0.561-1.291 0.561s-0.954-0.224-1.291-0.561l-2.806-2.806c-0.337-0.337-0.561-0.842-0.561-1.291s0.224-0.954 0.561-1.291l26.148-26.148c0.337-0.337 0.842-0.561 1.291-0.561s0.954 0.224 1.291 0.561l26.148 26.148c0.337 0.337 0.561 0.842 0.561 1.291z"
			            />
			          </svg>
			        </div>
			      </div>
			      <div
			        class="ss__dropdown__content"
			      >
			        <div
			          class="ss__facet__options"
			          open="true"
			        >
			          <div
			            class="ss__facet-list-options ss__facet__facet-list-options emotion-3"
			          >
			            <a
			              aria-label="filter by Summer"
			              class="ss__facet-list-options__option"
			            >
			              <span
			                aria-label=" unchecked checkbox"
			                class="ss__checkbox ss__facet-list-options__checkbox emotion-4"
			                role="checkbox"
			              >
			                <span
			                  class="ss__checkbox__empty"
			                />
			              </span>
			              <span
			                class="ss__facet-list-options__option__value"
			              >
			                Summer
			                <span
			                  class="ss__facet-list-options__option__value__count"
			                >
			                  (577)
			                </span>
			              </span>
			            </a>
			            <a
			              aria-label="filter by Spring"
			              class="ss__facet-list-options__option"
			            >
			              <span
			                aria-label=" unchecked checkbox"
			                class="ss__checkbox ss__facet-list-options__checkbox emotion-4"
			                role="checkbox"
			              >
			                <span
			                  class="ss__checkbox__empty"
			                />
			              </span>
			              <span
			                class="ss__facet-list-options__option__value"
			              >
			                Spring
			                <span
			                  class="ss__facet-list-options__option__value__count"
			                >
			                  (444)
			                </span>
			              </span>
			            </a>
			            <a
			              aria-label="filter by Fall"
			              class="ss__facet-list-options__option"
			            >
			              <span
			                aria-label=" unchecked checkbox"
			                class="ss__checkbox ss__facet-list-options__checkbox emotion-4"
			                role="checkbox"
			              >
			                <span
			                  class="ss__checkbox__empty"
			                />
			              </span>
			              <span
			                class="ss__facet-list-options__option__value"
			              >
			                Fall
			                <span
			                  class="ss__facet-list-options__option__value__count"
			                >
			                  (252)
			                </span>
			              </span>
			            </a>
			            <a
			              aria-label="filter by Winter"
			              class="ss__facet-list-options__option"
			            >
			              <span
			                aria-label=" unchecked checkbox"
			                class="ss__checkbox ss__facet-list-options__checkbox emotion-4"
			                role="checkbox"
			              >
			                <span
			                  class="ss__checkbox__empty"
			                />
			              </span>
			              <span
			                class="ss__facet-list-options__option__value"
			              >
			                Winter
			                <span
			                  class="ss__facet-list-options__option__value__count"
			                >
			                  (39)
			                </span>
			              </span>
			            </a>
			          </div>
			        </div>
			      </div>
			    </div>
			  </div>
			</DocumentFragment>
		`);
		});
	});

	describe('Grid Facet Display', () => {
		it('renders', () => {
			const args = {
				facet: { ...gridFacetMock, display: 'grid' } as ValueFacet,
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();
			const count = facetElement?.querySelectorAll('.ss__facet-grid-options__option').length;
			expect(count).toEqual(args.facet['values'].length);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	describe('Palette Facet Display', () => {
		it('renders', () => {
			const args = {
				facet: { ...paletteFacetMock, display: 'palette' } as ValueFacet,
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet facet={args.facet} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();
			const count = facetElement?.querySelectorAll('.ss__facet-palette-options__option').length;
			expect(count).toEqual(args.facet['values'].length);
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	describe('Slider Facet Display', () => {
		it('renders', () => {
			const args = {
				//@ts-ignore
				facet: { ...sliderFacetMock, display: 'slider' } as RangeFacet,
			};
			args.facet.collapsed = false;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options')!;
			expect(facetElement).toBeInTheDocument();
			const sliderElement = facetElement.querySelector('.ss__facet-slider');
			expect(sliderElement).toBeInTheDocument();
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});

	describe('Hierarchy Facet Display', () => {
		it('renders', () => {
			const args = {
				facet: { ...hierarchyFacetMock, display: 'hierarchy' } as ValueFacet,
			};
			args.facet.collapsed = false;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__options');
			expect(facetElement).toBeInTheDocument();
			const hierarchyElement = facetElement?.querySelector('.ss__facet-hierarchy-options');
			expect(hierarchyElement).toBeInTheDocument();
			expect(rendered.asFragment()).toMatchSnapshot();
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
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('show more/less text prop', async () => {
			const args = {
				facet: facetOverflowMock as ValueFacet,
				showMoreText: 'Show More please',
				showLessText: 'Show Less please',
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelector('.ss__facet__show-more-less')!;
			expect(facetElement).toBeInTheDocument();
			expect(facetElement).toHaveTextContent(args.showMoreText);
			expect(rendered.asFragment()).toMatchSnapshot();

			userEvent.click(facetElement);

			await waitFor(() => expect(facetElement).toHaveTextContent(args.showMoreText));
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('renders with specified icons', async () => {
			const args = {
				facet: facetOverflowMock as ValueFacet,
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
			expect(rendered.asFragment()).toMatchSnapshot();

			args.facet.collapsed = false;

			const rendered2 = render(<Facet {...args} />);

			const headerIconElement2 = rendered2.container.querySelector('.ss__facet__header .ss__icon');
			const showMoreLessElem2 = rendered2.container.querySelector('.ss__facet__show-more-less .ss__icon');

			expect(headerIconElement2).toBeInTheDocument();
			expect(headerIconElement2).toHaveClass(`ss__icon--${args.iconCollapse}`);
			expect(showMoreLessElem2).toHaveClass(`ss__icon--${args.iconOverflowMore}`);
			expect(rendered2.asFragment()).toMatchSnapshot();
		});

		it('set custom overflow slot', async () => {
			const elem = <span className="findMe">Show More please</span>;
			const args = {
				facet: facetOverflowMock as ValueFacet,
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
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('set custom options slot', async () => {
			const option = <span className="findMe">stuff and things</span>;
			const args = {
				facet: facetOverflowMock as ValueFacet,
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
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can use limit prop', async () => {
			const args = {
				facet: facetOverflowMock as ValueFacet,
				limit: 3,
				disableOverflow: true,
			};
			// @ts-ignore - readonly
			args.facet.refinedValues = args.facet.values;
			const rendered = render(<Facet {...args} />);
			const facetElement = rendered.container.querySelectorAll('.ss__facet-list-options__option');

			expect(facetElement.length).toBe(args.limit);
			expect(rendered.asFragment()).toMatchSnapshot();
		});

		it('can use searchable prop', async () => {
			const args = {
				facet: { ...listFacetMock, display: 'list' } as ValueFacet,
				searchable: true,
			};
			const rendered = render(<Facet {...args} />);

			const searchInputElement = rendered.container.querySelector('.ss__search-input input')!;
			expect(searchInputElement).toBeInTheDocument();
			expect(rendered.asFragment()).toMatchSnapshot();
			userEvent.type(searchInputElement, 'su');

			await waitFor(() => expect(searchInputElement).toHaveValue('su'));
			expect(searchInputElement).toHaveValue('su');

			const optionsElement = rendered.container.querySelector('.ss__facet__options');
			expect(optionsElement).toHaveTextContent('Summer');
			expect(rendered.asFragment()).toMatchSnapshot();
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
		expect(rendered.asFragment()).toMatchSnapshot();
	});

	it('disables styles', () => {
		const args = {
			facet: listFacetMock as ValueFacet,
			disableStyles: true,
		};

		const rendered = render(<Facet {...args} />);

		const facetElement = rendered.container.querySelector('.ss__facet');

		expect(facetElement?.classList).toHaveLength(3);
		expect(rendered.asFragment()).toMatchSnapshot();
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
			expect(rendered.asFragment()).toMatchSnapshot();
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
			expect(rendered.asFragment()).toMatchSnapshot();
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
			expect(rendered.asFragment()).toMatchSnapshot();
		});
	});
});

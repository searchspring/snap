import type { LangComponents } from '../components/src/providers/langComponents';
import type { ValueFacet } from '@searchspring/snap-store-mobx';

export const en_translation: LangComponents = {
	recommendation: {},
	button: {},
	search: {},
	list: {},
	layoutSelector: {
		label: {
			value: 'layout',
		},
	},
	radioList: {},
	autocomplete: {
		trendingTitle: {
			value: 'Popular Searches',
		},
		termsTitle: {
			value: '',
		},
		contentTitle: {
			value: '',
		},
		facetsTitle: {
			value: '',
		},
		historyTitle: {
			value: 'Previously Searched',
		},
		closeButton: {
			value: 'Close Autocomplete',
			attributes: {
				'aria-label': 'close autocomplete',
			},
		},
		noResultsText: {
			value: (data) =>
				`<p>No results found for "${
					data?.controller.store.search.originalQuery?.string || data?.controller.store.search.query?.string
				}".</p><p>Please try another search.</p>`,
		},
		contentInfo: {
			value: (data) =>
				`See ${data?.controller.store.pagination.totalResults} ${
					data?.controller.store.filters.length && data?.controller.store.filters.length > 0 ? 'filtered' : ''
				} result${data?.controller.store.pagination.totalResults == 1 ? '' : 's'} for "${data?.controller.store.search.query?.string}"`,
		},
		historyTerm: {
			attributes: {
				'aria-label': (data) => `item ${data?.index! + 1} of ${data?.controller.store.history.length}, ${data?.term.value}`,
			},
		},
		trendingTerm: {
			attributes: {
				'aria-label': (data) => `item ${data?.index! + 1} of ${data?.controller.store.trending.length}, ${data?.term.value}`,
			},
		},
		suggestionsTerm: {
			attributes: {
				'aria-label': (data) => `item ${data?.index! + 1} of ${data?.controller.store.terms.length}, ${data?.term.value}`,
			},
		},
	},
	sidebar: {
		titleText: {
			value: 'Filters',
		},
	},
	recommendationBundle: {
		seedText: {
			value: 'This Product',
		},
		ctaButtonText: {
			value: 'Add All To Cart',
		},
		ctaButtonSuccessText: {
			value: 'Bundle Added!',
		},
	},
	mobileSidebar: {
		openButtonText: {
			value: 'Filters',
		},
		clearButtonText: {
			value: 'Clear All',
		},
		applyButtonText: {
			value: 'Apply',
		},
		titleText: {
			value: 'Filter Options',
		},
		closeButtonText: {
			attributes: {
				'aria-label': `close Filters button`,
			},
		},
	},
	sortBy: {
		label: {
			value: 'Sort By',
		},
	},
	perPage: {
		label: {
			value: 'Per Page',
		},
	},
	facetsHorizontal: {
		dropdownButton: {
			attributes: {
				'aria-label': (data) =>
					`currently ${data?.selectedFacet?.field === data?.facet.field ? 'collapsed' : 'open'} ${data?.facet.field} facet dropdown ${
						(data?.facet as ValueFacet).values?.length ? (data?.facet as ValueFacet).values?.length + ' options' : ''
					}`,
			},
		},
	},
	filterSummary: {
		title: {
			value: 'Current Filters',
		},
		clearAllLabel: {
			value: 'Clear All',
		},
	},
	facet: {
		showMoreText: {
			value: 'show more',
		},
		showLessText: {
			value: 'show less',
		},
		dropdownButton: {
			attributes: {
				'aria-label': (data) =>
					`currently ${data?.facet?.collapsed ? 'collapsed' : 'open'} ${data?.facet.label} facet dropdown ${
						(data?.facet as ValueFacet).values?.length ? (data?.facet as ValueFacet).values?.length + ' options' : ''
					}`,
			},
		},
	},
	select: {
		buttonLabel: {
			attributes: {
				'aria-label': (data) =>
					`${data?.label} dropdown, ${data?.options.length} options ${
						data?.selectedOptions.length ? `, Currently selected option is ${data?.selectedOptions[0].label}` : ''
					}`,
			},
		},
	},
	radio: {
		radio: {
			attributes: {
				'aria-label': (data) => `${data?.disabled ? 'disabled' : ''} ${data?.checkedState ? 'checked' : 'unchecked'} radio button`,
			},
		},
	},
	pagination: {
		previous: {
			attributes: {
				'aria-label': 'go to previous page',
			},
		},
		next: {
			attributes: {
				'aria-label': 'go to next page',
			},
		},
		first: {
			attributes: {
				'aria-label': 'go to first page',
			},
		},
		last: {
			attributes: {
				'aria-label': (data) => `go to last page ${data?.paginationStore.last.number}`,
			},
		},
		page: {
			attributes: {
				'aria-label': (data) => `go to page ${data?.page.number}`,
			},
		},
	},
	loadMore: {
		loadMoreButton: {
			attributes: {
				'aria-label': 'Load More',
			},
		},
		progressText: {
			value: (data) => `You've viewed ${data?.paginationStore?.end} of ${data?.paginationStore?.totalResults} products`,
		},
	},
	grid: {
		showMoreText: {
			value: (data) => `+ ${data?.remainder}`,
		},
		showLessText: {
			value: 'Less',
		},
	},
	filter: {
		filter: {
			attributes: {
				'aria-label': (data) => `${!data?.label ? data?.value || '' : `remove selected ${data?.label} filter ${data?.value}`}`,
			},
		},
	},
	facetSlider: {
		sliderHandle: {
			attributes: {
				'aria-label': (data) => `${data?.facet.label} slider button`,
				'aria-valuetext': (data) =>
					`${data?.facet.label} slider button, current value ${data?.value}, ${
						data?.facet.range?.low ? `min value ${data?.facet.range?.low},` : ``
					} ${data?.facet.range?.high ? `max value ${data?.facet.range?.high}` : ``}`,
			},
		},
	},
	facetPaletteOptions: {
		paletteOption: {
			attributes: {
				'aria-label': (data) =>
					`${
						data?.value.filtered
							? `remove selected filter ${data?.facet?.label || ''} - ${data?.value.label}`
							: data?.facet?.label
							? `filter by ${data?.facet?.label} - ${data?.value.label}`
							: `filter by ${data?.value.label}`
					}`,
			},
		},
	},
	facetListOptions: {
		listOption: {
			attributes: {
				'aria-label': (data) =>
					`${
						data?.value.filtered
							? `remove selected filter ${data?.facet?.label || ''} - ${data?.value.label}`
							: data?.facet?.label
							? `filter by ${data?.facet?.label} - ${data?.value.label}`
							: `filter by ${data?.value.label}`
					}`,
			},
		},
	},
	facetHierarchyOptions: {
		hierarchyOption: {
			attributes: {
				'aria-label': (data) =>
					`${
						data?.value.filtered
							? `remove selected filter ${data?.facet?.label || ''} - ${data?.value.label}`
							: data?.facet?.label
							? `filter by ${data?.facet?.label} - ${data?.value.label}`
							: `filter by ${data?.value.label}`
					}`,
			},
		},
	},
	facetGridOptions: {
		gridOption: {
			attributes: {
				'aria-label': (data) =>
					`${
						data?.value.filtered
							? `remove selected filter ${data?.facet?.label || ''} - ${data?.value.label}`
							: data?.facet?.label
							? `filter by ${data?.facet?.label} - ${data?.value.label}`
							: `filter by ${data?.value.label}`
					}`,
			},
		},
	},
	errorHandler: {
		warningText: {
			value: `<b>Warning:&nbsp;</b>`,
		},
		infoText: {
			value: `<b>Info:&nbsp;</b>`,
		},
		errorText: {
			value: `<b>Error:&nbsp;</b>`,
		},
		reloadText: {
			value: `Reload`,
		},
	},
	checkbox: {
		checkbox: {
			attributes: {
				'aria-label': (data) => `${data?.disabled ? 'disabled' : ''} ${data?.checkedState ? 'checked' : 'unchecked'} checkbox`,
			},
		},
	},
	// toggle: {
	// 	toggleSwitch: {
	// 		attributes: {
	// 			'aria-label': (data) =>
	// 				`currently ${data?.toggledState ? 'selected' : 'not selected'} toggle switch ${data?.label ? `for ${data?.label}` : ''} `,
	// 		},
	// 	},
	// },
	// terms: {
	// 	term: {
	// 		value: (data) => `${data?.term.value}`,
	// 		attributes: {
	// 			'aria-label': (data) => `item ${(data?.index || 0) + 1} of ${data?.numberOfTerms}, ${data?.term.value}`,
	// 		},
	// 	},
	// },
	searchHeader: {
		titleText: {
			value: (data) => {
				return `Showing ${
					data?.pagination?.multiplePages
						? `<span class="ss__search-header__results-count-range"> ${data.pagination?.begin} - ${data.pagination?.end} of </span>`
						: ''
				} 
                <span class="ss__search-header__results-count-total">${data?.pagination?.totalResults}</span> 
                result${data?.pagination?.totalResults == 1 ? '' : 's'} 
                ${data?.search?.query ? `for <span class="ss__search-header__results-query">"${data.search.query.string}"</span>` : ''}
            `;
			},
			attributes: {
				'aria-label': (data) => `Now showing ${data?.pagination?.totalResults} items in the product grid`,
			},
		},
		correctedQueryText: {
			value: (data) => {
				return `No results found for <em>"${data?.search?.originalQuery?.string}"</em>, showing results for <em>"${data?.search?.query?.string}"</em> instead.`;
			},
			attributes: {
				'aria-label': (data) =>
					`No results found for ${data?.search?.originalQuery?.string}, showing results for ${data?.search?.query?.string} instead`,
			},
		},
		noResultsText: {
			value: (data) => {
				return `${
					data?.search?.query
						? `<span>
                    No results for <span class="ss__search-header__results-query">"${data.search.query.string}"</span> found.
                </span>`
						: `<span>No results found.</span>`
				}`;
			},
			attributes: {
				'aria-label': (data) => `No results found for ${data?.search?.query?.string}`,
			},
		},
		didYouMeanText: {
			value: (data) => {
				return `Did you mean <a href=${data?.search?.didYouMean?.url.href}>${data?.search?.didYouMean?.string}</a>?`;
			},
		},
	},
	noResults: {
		suggestionsTitleText: {
			value: `Suggestions`,
		},
		suggestionsList: {
			value:
				'<ul className="ss__no-results__suggestions__list"><li className="ss__no-results__suggestions__list__option">Check for misspellings.</li><li className="ss__no-results__suggestions__list__option">Remove possible redundant keywords (ie. "products").</li><li className="ss__no-results__suggestions__list__option">Use other words to describe what you are searching for.</li></ul>',
		},
		contactsTitleText: {
			value: `Still can't find what you're looking for? <a href="/contact-us">Contact us</a>.`,
		},
		contactsList: {
			value: `<div className='ss__no-results__contact__detail'>
                        <h4 className="ss__no-results__contact__detail__title">Address</h4>
                        <p className="ss__no-results__contact__detail__content">123 Street Address City, State, Zipcode</p>
                    </div>
                    <div className='ss__no-results__contact__detail'>
                        <h4 className="ss__no-results__contact__detail__title">Hours</h4>
                        <p className="ss__no-results__contact__detail__content">Monday - Saturday, 00:00am - 00:00pm Sunday, 00:00am - 00:00pm</p>
                    </div>
                    <div className='ss__no-results__contact__detail'>
                        <h4 className="ss__no-results__contact__detail__title">Phone</h4>
                        <p className="ss__no-results__contact__detail__content"><a href="tel:1234567890">123-456-7890</a></p>
                    </div>
                    <div className='ss__no-results__contact__detail'>
                        <h4 className="ss__no-results__contact__detail__title">Email</h4>
                        <p className="ss__no-results__contact__detail__content"><a href="mailto:email@site.com">email@site.com</a></p>
                    </div>`,
		},
	},
};

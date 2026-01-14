# Search

To set up Search using Snap, we'll need to define a search controller in our Snap configuration. See [SearchController reference](https://searchspring.github.io/snap/reference-controller-search) for all available configuration options.


```js
// src/index.js

import { Snap } from '@searchspring/snap-preact';

const snap = new Snap({
    client: {
		globals: {
			siteId: 'REPLACE_WITH_YOUR_SITE_ID',
		},
	},
    controllers: {
        search: [
            {
                config: {
                    id: 'search',
                },
                targeters: [
                    {
                        selector: '#searchspring-content',
                        component: async () => {
                            return (await import('./components/Content/Content')).Content;
                        },
                    },
                ],
            },
        ],
    },
});
```

## Category Pages / Background Filters
Optionally, apply filters from the page's content to the SearchControllerConfig `globals.filters` property. The controller globals are similar to the client globals in that all search requests will include the parameters specified. This can be used to configure category/brand pages, or other special filtering to apply to the current page's search requests.

For example, if a global variable `snapConfig` exists on the page (must be defined prior to our Snap script):

```html
<script>
	const snapConfig = {
		shopper: {
			id: 'shopper@emailprovider.com'
		},
		category: {
			name: 'Shirts',
			value: 'Clothing/Shirts'
		}
	}
</script>
```

```js
// src/index.js

import { Snap } from '@searchspring/snap-preact';

const backgroundFilters = [];
if (snapConfig?.category) {
	backgroundFilters.push({
		type: 'value',
		background: true,
		field: 'categories_hierarchy',
		value: snapConfig.category.value,
	});
}
const snap = new Snap({
    client: {
		globals: {
			siteId: 'REPLACE_WITH_YOUR_SITE_ID',
		},
	},
    controllers: {
        search: [
            {
                config: {
                    id: 'search',
					globals: {
						filters: backgroundFilters,
					},
                },
                targeters: [
                    {
                        selector: '#searchspring-content',
                        component: async () => {
                            return (await import('./components/Content/Content')).Content;
                        },
                    },
                ],
            },
        ],
    },
});
```

## Search Store

This section covers the properties available on the Search Store via a Search Controller with examples of how to implement common custom components. Alternatively, equivalent and additional components are available in the `@searchspring/snap-preact-components` package. See [Preact Component Library](https://searchspring.github.io/snap/preact-components) for all available components and their usage.


### SearchController.store.merchandising

The `merchandising` property contains merchandising redirects and banner content. It is recommended to utilize the `<Banner/>` component from `@searchspring/snap-preact-components` to display the various merchandising banners.

The available banner types include: `header`, `banner`, `footer`, `left`, `inline`

For inline banners, the `<InlineBanner/>` component should be used instead. An example of this usage can be found in the [store.results](https://searchspring.github.io/snap/snap-search#searchcontrollerstoreresults) section below.

```jsx
// src/components/Content/Content.jsx

import { h } from 'preact';
import { observer } from 'mobx-react';
import { ControllerProvider, Banner, Pagination } from '@searchspring/snap-preact-components';
import { Results } from '../Results/Results';
import { NoResults } from '../NoResults/NoResults';
import { SearchHeader } from '../SearchHeader/SearchHeader';

export const Content = observer((props) => {
    const { controller } = props;

    return controller.store.loaded ? (
        <ControllerProvider controller={controller}>
            <div class="ss__content">
				<Banner content={merchandising.content} type="header" />
				<Banner content={merchandising.content} type="banner" />
				<SearchHeader />
				{
					pagination.totalResults > 0 
					? (<Results />) : 
					(<NoResults />)
				}
				<Pagination />
				<Banner content={merchandising.content} type="footer" />
			</div>
        </ControllerProvider>
    ) : null;
});
```

### SearchController.store.search

The `search` property contains information about the current query, typically displayed above results and used in combination with the `store.pagination` data.

```jsx
// src/components/SearchHeader/SearchHeader.jsx

import { h } from 'preact';
import { observer } from 'mobx-react';
import { withController } from '@searchspring/snap-preact-components';

export const SearchHeader = withController(observer((props) => {
    const { controller } = props;
	const { store } = controller;
	const { pagination, search } = store;
	const originalQuery = search.originalQuery;

	return (
		store.loaded && (
			<div class="ss__search-header">
				{pagination.totalResults ? (
					<h1 class="ss__search-header--results">
						{`Showing `}
						{pagination.multiplePages && <span class="ss__search-header__count-range">{` ${pagination.begin} - ${pagination.end} of `}</span>}
						<span class="ss__search-header__count-total">{pagination.totalResults}</span>
						{` result${pagination.totalResults == 1 ? '' : 's'}`}
						{search?.query && (
							<span>
								{` for `}
								<span class="ss__search-header__query">"{search.query.string}"</span>
							</span>
						)}
					</h1>
				) : (
					pagination.totalResults === 0 && (
						<h1 class="ss__search-header--noresults">
							{search?.query ? (
								<span>
									No results for <span class="ss__search-header__query">"{search.query.string}"</span> found.
								</span>
							) : (
								<span>No results found.</span>
							)}
						</h1>
					)
				)}

				{originalQuery && (
					<div class="ss__oq">
						Search instead for "<a href={originalQuery.url.href}>{originalQuery.string}</a>"
					</div>
				)}
			</div>
		)
	);
}));
```

### SearchController.store.pagination

The `pagination` property is not only used for information about the current query, but also contains everything needed for handling pagination of a query that yields multiple pages. Invoking the `getPages` method will retrieve the specified number of page objects. For more about the pagination store, checkout the [Search Controller reference](https://searchspring.github.io/snap/reference-controller-search).

```jsx
// src/components/Pagination/Pagination.jsx

import { h } from 'preact';
import { observer } from 'mobx-react';
import { withController } from '@searchspring/snap-preact-components';

export const Pagination = withController(observer((props) => {
	const { controller } = props;
	const { store } = props.controller;
	const { pagination } = store;
	
	const MINIMUM_PAGES = 5;
	const pages = pagination.getPages(MINIMUM_PAGES);
	
	return (
		<div class="ss__pagination">
			{pagination.previous && (
				<span class="ss__pagination__prev">
					<a {...pagination.previous.url.link} title="Previous">
						Prev
					</a>
				</span>
			)}

			{pages.map((page) => (
				<span key={page.key} class={`ss__pagination__page ${page.active ? 'ss__pagination__page--current' : ''}`}>
					<a {...page.url.link}>{page.number}</a>
				</span>
			))}

			{pagination.next && (
				<span class="ss__pagination__next">
					<a {...pagination.next.url.link} title="Next">
						Next
					</a>
				</span>
			)}
		</div>
	)
}));
```

### SearchController.store.sorting

The `sorting` property contains sorting options applicable to the current query. Typically used to render a `<select>` dropdown of sorting options. 

Sorting settings can be configured in the [Searchspring Management Console](https://manage.searchspring.net/)

```jsx
// src/components/SortBy/SortBy.jsx

import { h } from 'preact';
import { observer } from 'mobx-react';
import { withController } from '@searchspring/snap-preact-components';

export const SortBy = withController(observer((props) => {
	const { controller } = props;
	const { store } = controller;
	const { sorting } = store;
	
	return sorting.length !== 0 ? (
		<div class="ss__sorting">
			<label for="ss__sort--select">Sort</label>

			<select
				name="ss__sort--select"
				id="ss__sort--select"
				onChange={(e) => {
					const selectedOption = sorting.options.filter((option) => option.value == e.target.value).pop();
					selectedOption && selectedOption.url.go();
				}}
			>
				{sorting.options.map((option) => (
					<option value={option.value} selected={option.value === sorting.current.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	) : null;
}));
```

### SearchController.store.results

The `results` property contains an array of result objects for the current page.

Each result object contains the following notable properties:

`result.type` will be 'product' or 'banner' (inline banner)

`result.mappings.core` core attributes configured in the [Searchspring Management Console](https://manage.searchspring.net/)

`result.attributes` remaining attributes

`result.mask` provides a way to temporarily modify result data without changing the underlying store data. This can be used in combination with the `result.display` for simple UI effects like showing alternate product images on hover, or more complex interactions like updating displayed prices when selecting different product variants.

`result.mask.merge` a function to merge new mask data with the current display state. This function accepts a single object as its only parameter.

`result.mask.set` a function to set the mask data. Overwrites the current mask data. This function accepts a single object as its only parameter.

`result.mask.clear` a function to clear the mask data, reverting to the original display state.

`result.display` an object used for display in result components. Containing the currently set display state from the `result.mask` combined with the underlying core data for the result. 

`result.variants` contains information about product variants like size and color options, as well as the variant selections data. (requires variants to be enabled and configured) For more variant integration information, see [Variants Reference](https://github.com/searchspring/snap/tree/main/docs/REFERENCE_VARIANTS.md)

`result.custom` an empty object that is not modified by core Snap packages. This is available for you to modify and store custom data to be rendered. See [`custom` property](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Abstract)

Note: if you will be creating a custom Result component, the `withTracking` hook is required to capture product impression and click analytics. See [Tracking](https://github.com/searchspring/snap/tree/main/docs/SNAP_TRACKING.md#impressions) for more information.

```jsx
// src/components/Results/Results.jsx

import { h } from 'preact';
import { observer } from 'mobx-react';
import { withController, withTracking, InlineBanner, Price } from '@searchspring/snap-preact-components';

export const Results = withController(observer((props) => {
	const { controller } = props;
	const { store } = controller;
	const { results } = store;
	
	return (
		<ul class="ss__results">
			{results.map((result) => (
				<li class="ss__result" key={result.id}>
					{{
						banner: <InlineBanner banner={result} />,
					}[result.type] || <Result result={result} />}
				</li>
			))}
		</ul>
	)
}));

const Result = withController(withTracking(observer((props) => {
	const { trackingRef, controller, result } = props;
	const { core } = result.mappings;

	return (
		<div className="ss__result" ref={trackingRef}>
			<a href={core.url}>
				{ core.name }
			</a>
			<Price value={core.price} />
			<button onClick={(e)=> controller.addToCart(result)}>Add to cart</button>
		</div>
	)
})));
```

### SearchController.store.facets

The `facets` property contains an array of facet objects for the current query.

Each result object contains the following notable properties:

`facet.collapsed` facet collapse state. Facets can be configured to start collapsed by default in the [Searchspring Management Console](https://manage.searchspring.net/)

`facet.toggleCollapse` a method that toggles the collapse state for this facet

`facet.clear` a method to remove the facet if it is currently active

`facet.label` the facet label to display (ie. Price, Size, Brand)

`facet.field` the raw facet field name

`facet.display` the facet display type - used to conditionally render different facet components. Available display types: `list` (default), `grid`, `palette`, `hierarchy`, `slider`. Facet display types can be configured in the [Searchspring Management Console](https://manage.searchspring.net/)

The example below displays a custom `FacetOptionsList` component for facets with a display type of `list`.

The `@searchspring/snap-preact-components` component library includes the following components that can be imported or used as a reference: `FacetListOptions`, `FacetGridOptions`, `FacetPaletteOptions`, `FacetHierarchyOptions`, `FacetSlider`

`facet.type` the facet type - Available facet types: `range`, `value`, `range-buckets`. 

Facets that contain a `type` value of `range` will not contain any `values` as this is typically used as a Slider. Instead, the facet will include `range.low`, `range.high`, `active.low`, and `active.high` properties.

Facets with a `type` value of `value` or `range-buckets` will contain the following properties:

`facet.search.input` facet search within - setting this will dynamically filter the facet `values` array to only include values that match the `facet.search.input` substring

`facet.overflow.setLimit` method to set the number of values to display before overflow occurs

`facet.overflow.toggle` method to toggle overflow of a facet, typically invoked `onClick` event of a facet 'show more' button

`facet.refinedValues` facet values that have been limitied if any overflow or search within is active; this should be used to render facet values from components

`facet.values` original facet values - it is not recommended to directly render facet values using this in your components - `facet.refinedValues` should be used instead - however, if you are using an `afterStore` event to reference facet values, `facet.values` should be used

```jsx
// src/components/Facets/Facets.jsx

import { h } from 'preact';
import { observer } from 'mobx-react';
import { withController, SearchInput, FacetGridOptions, FacetPaletteOptions, FacetOptionsHierarchy, FacetSlider } from '@searchspring/snap-preact-components';

export const Facets = withController(observer((props) => {
	const { controller } = props;
	const { store } = controller;
	const { facets } = store;
	
	return facets.length !== 0 ? (
		<div class="ss__facets">
			{facets.map((facet) => (
				<Facet facet={facet} key={facet.field} />
			))}
		</div>
	) : null;
}));

const Facet = withController(observer((props) => {
	const { facet } = props;
	
	return facets.length !== 0 ? (
		<div class="ss__facet">
			<h5 
				onClick={() => { 
					facet.toggleCollapse() 
				}}
				className={`ss__facet__header ${facet.collapsed ? 'ss__facet__header--collapsed' : 'ss__facet__header--expanded'}`}>
				{facet.label}
			</h5>
			{['list', 'grid', 'palette'].includes(facet.display) && (
				<SearchInput onChange={(e) => facet.search.input = e.target.value} placeholder={`Search ${facet.label}`} />
			)}
			<div className="ss__facet__options">
				{{
					grid: <FacetGridOptions facet={facet} />,
					palette: <FacetPaletteOptions facet={facet} />,
					hierarchy: <FacetOptionsHierarchy facet={facet} />,
					slider: <FacetSlider facet={facet} />,
				}[facet.display] || <FacetOptionsList facet={facet} />}
			</div>
		</div>
	) : null;
}));

// custom FacetOptionsList component instead of importing from @searchspring/snap-preact-components
const FacetOptionsList = withController(observer((props) => {
	const { facet } = props;
	const values = facet.refinedValues;
	
	return (
		<ul class="ss__facet__options__list">
			{values.map((value) => {
				return (
					<li class={`ss__facet__options__list__option ${value.filtered ? 'ss__facet__options__list__option--active' : ''}`}>
						<a {...value.url.link} title={`Remove filter ${value.label}`}>
							{value.label}
						</a>
					</li>
				);
			})}
		</ul>
	)
}));
```


### SearchController.store.filters

The `filters` property contains an array of filters that are currently applied to the query.

Typically used to display a filter summary with options to remove filters.

```jsx
// src/components/FilterSummary/FilterSummary.jsx

import { h } from 'preact';
import { observer } from 'mobx-react';
import { withController } from '@searchspring/snap-preact-components';

export const FilterSummary = withController(observer((props) => {
	const { controller } = props;
	const { store } = controller;
	const { filters } = store;
	
	return filters.length !== 0 ? (
		<ul class="ss__filter-summary">
			<div className="ss__filter-summary__title">Current Filters</div>
			{filters.map((filter) => (
				<li class="ss__filter-summary__filter" key={filter.label}>
					<a
						title={`Remove filter ${filter.label}`}
						className="ss__filter-summary__filter__link"
						aria-label={`remove selected ${filter.facet.label} filter ${filter.value.label}`}
						{...filter.url.link}
					>
						<span className="ss__filter__label">
							{filter.facet.label}:
						</span>
						<span className="ss__filter__value">{filter.value.label}</span>
					</a>
				</li>
			))}
		</ul>	
	) : null;
}));
```


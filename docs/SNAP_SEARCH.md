# Search

To set up Search using Snap, we'll need to define a search controller in our Snap configuration. See [SearchController reference](https://searchspring.github.io/snap/reference-controller-search) for all available configuration options.


```ts
// src/index.ts

const snap = new Snap({
    client: {
		globals: {
			siteId: 'abc123',
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

### Category Pages / Background Filters
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

```typescript
// src/index.ts
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
			siteId: 'abc123',
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

The following properties are specific to a Search Store via a Search Controller.


### SearchController.store.merchandising

The `merchandising` property contains merchandising redirects and banner content. It is recommended to utilize the `<Banner/>` component from `@searchspring/snap-preact-components` to display the various merchandising banners.

The available banner types include: `header`, `banner`, `footer`, `left`, `inline`

For inline banners, the `<InlineBanner/>` component should be used instead. An example of this usage can be found in the 'store.results' section below.

```jsx
import { Banner } from '@searchspring/snap-preact-components';

@observer
export class Content extends Component {
	render() {
		const controller = this.props.controller;
		const { store } = controller;
		const { pagination, merchandising } = store;

		return (
			store.loaded && (
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
			)
		);
	}
}
```

### SearchController.store.search

The `search` property contains information about the current query, typically displayed above results and used in combination with the `store.pagination` data.

```jsx
@withController
@observer
export class SearchHeader extends Component {
	render() {
		const { controller } = this.props;
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
	}
}
```

### SearchController.store.pagination

The `pagination` property is not only used for information about the current query, but also contains everything needed for handling pagination of a query that yields multiple pages. Invoking the `getPages` method will retrieve the specified number of page objects. For more about the pagination store, checkout the [Search Controller reference](https://searchspring.github.io/snap/reference-controller-search).

```jsx
@withController
@observer
export class Pagination extends Component {
	render() {
		const controller = this.props.controller;
		const {
			store: { pagination },
		} = controller;
		const pages = pagination.getPages(5);

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
		);
	}
}
```

### SearchController.store.sorting

The `sorting` property contains sorting options applicable to the current query. Typically used to render a `<select>` dropdown of sorting options. 

Sorting settings can be configured in the [Searchspring Management Console](https://manage.searchspring.net/)

```jsx
@withController
@observer
export class SortBy extends Component {
	render() {
		const controller = this.props.controller;
		const { sorting } = controller.store;

		return (
			sorting.length !== 0 && (
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
			)
		);
	}
}
```

### SearchController.store.results

The `results` property contains an array of result objects for the current page.

Each result object contains the following notable properties:

`result.type` will be 'product' or 'banner' (inline banner)

`result.mappings.core` core attributes configured in the [Searchspring Management Console](https://manage.searchspring.net/)

`result.attributes` remaining attributes

`result.custom` an empty object that is not modified by core Snap packages. This is available for you to modify and store custom data to be rendered. See [`custom` property](https://github.com/searchspring/snap/tree/main/packages/snap-store-mobx/src/Abstract)

Note: if you will be creating a custom Result component, be sure to include intellisuggest product click tracking. Available via `controller.track.product.click()` as seen in the example below. This should be invoked `onClick` or `onMouseDown` on each Result.

```jsx
@withController
@observer
export class Results extends Component {
	render() {
		const controller = this.props.controller;
		const { results } = controller.store;

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
		);
	}
}

@withController
@observer
class Result extends Component {
	render() {
		const { result } = this.props;
		const {
			attributes,
			mappings: { core },
		} = result;
		const intellisuggest = (e) => controller.track.product.click(e, result);

		return (
			result && (
				<div>
					<a href={core.url} onClick={intellisuggest}>
						{core.name}
					</a>
					<hr />
					<Price value={core.price} />
				</div>
			)
		);
	}
}
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
@withController
@observer
export class Facets extends Component {
	render() {
		const { facets } = this.props.controller.store;

		return (
			facets.length !== 0 && (
				<div class="ss__facets">
					{facets.map((facet) => (
						<Facet facet={facet} />
					))}
				</div>
			)
		);
	}
}

@withController
@observer
export class Facet extends Component {
	render() {
		const { facet } = this.props;

		return (
			facet && (
				<div class="ss__facet">
					<h5
						onClick={() => {
							facet.toggleCollapse();
						}}
					>
						{facet.label}
					</h5>

					<div class={`ss__facet--field-${facet.field} ss__facet--display-${facet.display} ${facet.collapsed ? 'ss__facet--collapsed' : ''}`}>
						<div class="collapsible-content__inner">
							{{
								grid: <div>grid component</div>,
								palette: <div>palette component</div>,
								hierarchy: <div>hierarchy component</div>,
								slider: <FacetSlider facet={facet} />,
							}[facet.display] || <FacetOptionsList facet={facet} />}
						</div>
					</div>
				</div>
			)
		);
	}
}

@observer
class FacetOptionsList extends Component {
	render() {
		const facet = this.props.facet;
		const values = facet.refinedValues;

		return (
			<ul class="ss__facet-options-list">
				{values.map((value) => {
					return (
						<li class={`ss__facet-options-list__option ${value.filtered ? 'ss__facet-options-list__option--active' : ''}`}>
							<a {...value.url.link} title={`Remove filter ${value.label}`}>
								{value.label}
							</a>
						</li>
					);
				})}
			</ul>
		);
	}
}
```


### SearchController.store.filters

The `filters` property contains an array of filters that are currently applied to the query.

Typically used to display a filter summary with options to remove filters.

```jsx
@withController
@observer
export class FilterSummary extends Component {
	render() {
		const controller = this.props.controller;
		const {
			store: { filters },
		} = controller;

		return (
			filters.length !== 0 && (
				<ul class="ss__filters">
					{filters.map((filter) => (
						<li class="ss__filters__filter">
							<a {...filter.url.link} title={`Remove filter ${filter.label}`}>
								{filter.label}
							</a>
						</li>
					))}
				</ul>
			)
		);
	}
}
```

